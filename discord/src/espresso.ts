import { readFileSync } from 'fs'
import { Client, Intents, Message } from 'discord.js'
import { web3, Program, Provider, Wallet } from '@project-serum/anchor'
import { Soloha } from './idl/soloha'
import { getUserAddressAndBump, hashAuthorTag } from './util'
import idl from './idl/soloha.json'

export type EspressoParameters = {
  acceptedGms: string[]
  channelId: string
  clusterEndpoint: string
  keypairPath: string
}

/**
 * The implementation and event handling class for the Discord
 * server bot to handle the transactions and message hooks.
 * @export
 * @class Espresso
 */
export default class Espresso {
  private static PROGRAM_ID = 'LHAPYTbqXFzkNxojt16Mx5gtAnnbhkZfMyLvU9xsKVe'

  private client: Client
  private keypair: web3.Keypair
  private program?: Program<Soloha>
  private statePublicKey: web3.PublicKey

  /**
   * Creates an instance of Espresso.
   * @param {string} version
   * @param {EspressoParameters} params
   * @memberof Espresso
   */
  constructor(public readonly version: string, private readonly params: EspressoParameters) {
    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
      ]
    })

    this.statePublicKey = web3.PublicKey.default
    this.keypair = web3.Keypair.fromSecretKey(
      Buffer.from(
        JSON.parse(
          readFileSync(this.params.keypairPath, {
            encoding: 'utf-8'
          })
        )
      )
    )

    this.client.once('ready', this._onReady)
    this.client.on('messageCreate', this._onMessage)
  }

  /**
   * Builds the `anchor.Program` instance for the Soloha
   * IDL and derives and sets the global state public key
   * as a class property.
   * @memberof Espresso
   */
  async initialize() {
    const wallet = new Wallet(this.keypair)
    const provider = new Provider(new web3.Connection(this.params.clusterEndpoint), wallet, {})
    this.program = new Program<Soloha>(idl as any, Espresso.PROGRAM_ID, provider)

    const [key] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('state')],
      this.program.programId
    )

    this.statePublicKey = key
  }

  /**
   * Initiates the Discord bot client login so it can
   * begin to listening and processing new GM messages.
   * @param {string} token
   * @memberof Espresso
   */
  async run(token: string) {
    try {
      await this.client.login(token)
    } catch (e) {
      console.error(`Fail to start: ${e}`)
      process.exit(1)
    }
  }

  /**
   * Simple logging handler for when the client connects.
   * @private
   * @memberof Espresso
   */
  private _onReady() {
    console.log(`Logged in as ${this.client.user?.tag}`)
  }

  /**
   * New message event handler to process the on-chain
   * instruction transaction for a properly formed "gm".
   * @private
   * @param {Message} msg
   * @memberof Espresso
   */
  private async _onMessage(msg: Message) {
    if (msg.channelId !== this.params.channelId || msg.author.bot) return

    const isGm: boolean = this.params.acceptedGms.some(gm => msg.content.trim().startsWith(gm))

    if (isGm) {
      console.log(`GM from ${msg.author.tag}`)

      const tagHash: Buffer = hashAuthorTag(msg.author.tag)
      const [pubkey] = await getUserAddressAndBump(this.program!.programId, tagHash)

      const user = await this.program!.account.user.fetchNullable(pubkey)
      if (!user) return

      const listener = this.program!.account.user.subscribe(pubkey, 'confirmed')

      try {
        listener.once('change', async (data: any) => {
          if (data.streak > 3) {
            await msg.edit(`${msg.content} (🔥 ${data.streak})`)
          }
        })

        const tx = this.program!.transaction.gm(
          { value: tagHash },
          {
            accounts: {
              authority: this.keypair.publicKey,
              state: this.statePublicKey,
              user: pubkey
            }
          }
        )

        await web3.sendAndConfirmTransaction(
          this.program!.provider.connection,
          tx,
          [this.keypair],
          { commitment: 'confirmed' }
        )

        await msg.react('☕')
      } catch (e) {
        console.error(`GM instruction failure: ${e}`)
      } finally {
        listener.removeAllListeners()
        await this.program!.account.user.unsubscribe(pubkey)
      }
    }
  }
}

import { readFileSync } from 'fs'
import { Client, Intents, Message } from 'discord.js'
import { web3, Program, Provider, Wallet, Context } from '@project-serum/anchor'
import { getUserAddressAndBump, hashAuthorTag } from './util'

export type EspressoParameters = {
  acceptedGms: string[]
  channelId: string
  clusterEndpoint: string
  idl: any
  keypairPath: string
}

export default class Espresso {
  private client: Client
  private keypair: web3.Keypair
  private program?: Program
  private statePublicKey: web3.PublicKey

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

  async initialize() {
    const wallet = new Wallet(this.keypair)
    const provider = new Provider(new web3.Connection(this.params.clusterEndpoint), wallet, {})
    this.program = new Program(this.params.idl, this.params.idl.metadata.address, provider)

    const [key] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('state')],
      this.program.programId
    )

    this.statePublicKey = key
  }

  async run(token: string) {
    try {
      await this.client.login(token)
    } catch (e) {
      console.error(`Fail to start: ${e}`)
      process.exit(1)
    }
  }

  private _onReady = () => {
    console.log(`Logged in as ${this.client.user?.tag}`)
  }

  private _onMessage = async (msg: Message) => {
    if (msg.channelId !== this.params.channelId || msg.author.bot) return

    const isGm: boolean = this.params.acceptedGms.some(gm => msg.content.trim().startsWith(gm))

    if (isGm) {
      console.log(`GM from ${msg.author.tag}`)

      const tagHash: Buffer = hashAuthorTag(msg.author.tag)
      const [pubkey] = await getUserAddressAndBump(this.program!.programId, tagHash)
      const listener = this.program!.account.user.subscribe(pubkey, 'confirmed')

      try {
        listener.once('change', async (data: any) => {
          if (data.streak > 3) {
            await msg.edit(`${msg.content} (🔥 ${data.streak})`)
          }
        })

        const tx = this.program!.transaction.gm({ value: tagHash }, {
          accounts: {
            authority: this.keypair.publicKey,
            state: this.statePublicKey,
            user: pubkey
          }
        } as Context)

        await web3.sendAndConfirmTransaction(
          this.program!.provider.connection,
          tx,
          [this.keypair],
          { commitment: 'confirmed' }
        )

        await msg.react('☕')
      } catch (e) {
        console.error(`GM instruction failure: ${e}`)
        await msg.delete()
      } finally {
        listener.removeAllListeners()
        await this.program!.account.user.unsubscribe(pubkey)
      }
    }
  }
}

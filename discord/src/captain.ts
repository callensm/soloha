import { Client, Intents, Message } from 'discord.js'
import { web3, Program, Idl, Provider, Wallet } from '@project-serum/anchor'
import { getAnchoriteAddressAndBump, hashAuthorTag } from './util'

export type CaptainParameters = {
  channelId: string
  clusterEndpoint: string
  keypairPath: string
  programId: string
}

export default class Captain {
  private client: Client
  private keypair: web3.Keypair
  private program?: Program

  constructor(public readonly version: string, private readonly params: CaptainParameters) {
    this.client = new Client({
      intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
    })
    this.keypair = web3.Keypair.fromSecretKey(Uint8Array.from([])) // FIXME:
    this._setupClientEventHandlers()
  }

  async initialize() {
    let idl: Idl

    try {
      const i = await Program.fetchIdl(this.params.programId)

      if (!i) {
        throw Error('received null idl from fetch')
      }

      idl = i
    } catch (e) {
      console.error(`Failed to initialize: ${e}`)
      process.exit(1)
    }

    const wallet = new Wallet(this.keypair)
    const provider = new Provider(new web3.Connection(this.params.clusterEndpoint), wallet, {})
    this.program = new Program(idl, this.params.programId, provider)
  }

  async run(token: string) {
    try {
      await this.client.login(token)
    } catch (e) {
      console.error(`Fail to start: ${e}`)
      process.exit(1)
    }
  }

  /**
   * Setups up all of the event handlers for the Discord client.
   * @private
   * @memberof Captain
   */
  private _setupClientEventHandlers() {
    this.client.on('message', this._onMessage)
  }

  private async _onMessage(msg: Message) {
    if (msg.channelId !== this.params.channelId || msg.author.bot) return

    const first = msg.content.trim().split(' ')[0].toLowerCase()

    if (first === 'gm' || first === 'gmoot') {
      const tagHash: Buffer = hashAuthorTag(msg.author.tag)

      try {
        const [pubkey, _bump] = await getAnchoriteAddressAndBump(this.program!.programId, tagHash)

        const tx = this.program!.transaction.gm(
          { value: tagHash },
          {
            accounts: {
              authority: this.keypair.publicKey,
              anchorite: pubkey,
              clock: web3.SYSVAR_CLOCK_PUBKEY
            }
          }
        )

        await web3.sendAndConfirmTransaction(this.program!.provider.connection, tx, [this.keypair])
        await msg.react(':coffee:')
      } catch (e) {
        console.error(`GM instruction failure: ${e}`)
      }
    }
  }
}

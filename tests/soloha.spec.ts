import * as anchor from '@project-serum/anchor'
import { NodeWallet } from '@project-serum/anchor/src/provider'
import { assert, use as chaiUse } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import crc32 from 'crc-32'

chaiUse(chaiAsPromised)

const discordTag = '@synxe#6138'
const tagHash = Buffer.from(crc32.str(discordTag).toString(16))

describe('soloha', () => {
  anchor.setProvider(anchor.Provider.env())

  const program: anchor.Program = anchor.workspace.Soloha
  const authority = (program.provider.wallet as NodeWallet).payer
  const owner = anchor.web3.Keypair.generate()

  let userKey: anchor.web3.PublicKey
  let userBump: number

  let stateKey: anchor.web3.PublicKey
  let stateBump: number

  before(async () => {
    const sig = await program.provider.connection.requestAirdrop(
      owner.publicKey,
      50 * anchor.web3.LAMPORTS_PER_SOL
    )
    await program.provider.connection.confirmTransaction(sig)
  })

  describe('initialize instruction', () => {
    before(async () => {
      ;[stateKey, stateBump] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('state')],
        program.programId
      )

      await program.rpc.initialize(stateBump, {
        accounts: {
          authority: authority.publicKey,
          state: stateKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [authority]
      } as anchor.Context)
    })

    it('creates the global state pda', async () => {
      const state = await program.account.state.all()
      assert.lengthOf(state, 1)
    })
  })

  describe('register instruction', () => {
    let testUser: anchor.ProgramAccount<any>

    before(async () => {
      ;[userKey, userBump] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('user'), Buffer.from(tagHash)],
        program.programId
      )

      await program.rpc.register({ value: tagHash }, userBump, {
        accounts: {
          owner: owner.publicKey,
          state: stateKey,
          user: userKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [owner]
      } as anchor.Context)
    })

    it('creates a new user account for the user', async () => {
      const users = await program.account.user.all()
      assert.lengthOf(users, 1)

      testUser = users[0]
      assert.isTrue(testUser.publicKey.equals(userKey))
      assert.strictEqual(testUser.account.bump[0], userBump)
    })

    it('sets the owner pubkey in data', () => {
      assert.isTrue((testUser.account.owner as anchor.web3.PublicKey).equals(owner.publicKey))
    })

    it('zeroes the timestamp of the last gm by default', () => {
      assert.strictEqual((testUser.account.lastGm as anchor.BN).toNumber(), 0)
    })

    it('adds one to global registered counter', async () => {
      const state = await program.account.state.fetch(stateKey)
      assert.strictEqual((state.registered as anchor.BN).toNumber(), 1)
    })
  })

  describe('gm instruction', () => {
    let userData: any

    before(async () => {
      await program.rpc.gm({ value: tagHash }, {
        accounts: {
          authority: authority.publicKey,
          state: stateKey,
          user: userKey
        },
        signers: [authority]
      } as anchor.Context)

      userData = await program.account.user.fetch(userKey)
    })

    it('updates the streak count', () => {
      assert.strictEqual(userData.streak as number, 1)
    })

    it('updates the last gm timestamp', () => {
      assert.isTrue(userData.lastGm > 0)
    })

    it('fails when done more than once per day', () => {
      assert.isRejected(
        program.rpc.gm({ value: tagHash }, {
          accounts: {
            authority: authority.publicKey,
            user: userKey
          },
          signers: [authority]
        } as anchor.Context)
      )
    })

    it('updates the global state streak number and owner', async () => {
      const state = await program.account.state.fetch(stateKey)
      assert.strictEqual(state.highestStreak, 1)
      assert.isTrue((state.highestStreakOwner as anchor.web3.PublicKey).equals(owner.publicKey))
    })
  })

  describe('deregister instruction', () => {
    before(async () => {
      await program.rpc.deregister({ value: tagHash }, {
        accounts: {
          owner: owner.publicKey,
          state: stateKey,
          user: userKey
        },
        signers: [owner]
      } as anchor.Context)
    })

    it('closes the user account passed', async () => {
      const users = await program.account.user.all()
      assert.isEmpty(users)
    })

    it('updates global state to decrement registered count', async () => {
      const state = await program.account.state.fetch(stateKey)
      assert.strictEqual((state.registered as anchor.BN).toNumber(), 0)
    })
  })
})

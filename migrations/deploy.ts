import * as anchor from '@project-serum/anchor'
import { NodeWallet } from '@project-serum/anchor/src/provider'
import { Soloha } from '../target/types/soloha'

const RESET_STATE_ACCOUNT: boolean = process.env.RESET_STATE !== undefined

module.exports = async function (provider: anchor.Provider) {
  anchor.setProvider(provider)

  const program: anchor.Program<Soloha> = anchor.workspace.Soloha
  const authority = (provider.wallet as NodeWallet).payer

  const [stateKey, stateBump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('state')],
    program.programId
  )

  if (RESET_STATE_ACCOUNT) {
    const sig = await program.rpc.deinitializeState({
      accounts: {
        authority: authority.publicKey,
        state: stateKey
      },
      signers: [authority]
    })

    await program.provider.connection.confirmTransaction(sig, 'finalized')
  }

  const sig = await program.rpc.initializeState(stateBump, {
    accounts: {
      authority: authority.publicKey,
      state: stateKey,
      systemProgram: anchor.web3.SystemProgram.programId
    },
    signers: [authority]
  })

  await program.provider.connection.confirmTransaction(sig, 'confirmed')
}

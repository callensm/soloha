import * as anchor from '@project-serum/anchor'
import { NodeWallet } from '@project-serum/anchor/src/provider'

module.exports = async function (provider: anchor.Provider) {
  anchor.setProvider(provider)

  const program: anchor.Program = anchor.workspace.Ahoy
  const authority = (provider.wallet as NodeWallet).payer

  const [stateKey, stateBump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('state')],
    program.programId
  )

  const sig = await program.rpc.initialize(stateBump, {
    accounts: {
      authority: authority.publicKey,
      state: stateKey,
      systemProgram: anchor.web3.SystemProgram.programId
    },
    signers: [authority]
  } as anchor.Context)

  await program.provider.connection.confirmTransaction(sig, 'confirmed')
}

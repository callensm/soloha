import { web3 } from '@project-serum/anchor'
import crc32 from 'crc-32'

export const hashAuthorTag = (tag: string): Buffer => Buffer.from(crc32.str(tag).toString(16))

export const getStateProgramAddress = (programId: web3.PublicKey) =>
  web3.PublicKey.findProgramAddress([Buffer.from('state')], programId)

export const getAnchoriteProgramAddress = (tagHash: Buffer, programId: web3.PublicKey) =>
  web3.PublicKey.findProgramAddress([Buffer.from('anchorite'), tagHash], programId)

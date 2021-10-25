import { web3 } from '@project-serum/anchor'
import crc32 from 'crc-32'

/**
 * Creates the stringified CRC-32 hash of the argued
 * Discord user tag.
 * @param {string} tag
 * @returns {Buffer}
 */
export const hashDiscordTag = (tag: string): Buffer => Buffer.from(crc32.str(tag).toString(16))

/**
 * Derives the public key and bump nonce for the global `State` PDA
 * using the static seed string.
 * @param {web3.PublicKey} programId
 * @returns {Promise<[web3.PublicKey, number]>}
 */
export const getStateProgramAddress = (
  programId: web3.PublicKey
): Promise<[web3.PublicKey, number]> =>
  web3.PublicKey.findProgramAddress([Buffer.from('state')], programId)

/**
 * Derives the public key and bump nonce for an `User` PDA
 * using the provided Discord user tag CRC-32 hash value.
 * @param {Buffer} tagHash
 * @param {web3.PublicKey} programId
 * @returns {Promise<[web3.PublicKey, number]>}
 */
export const getUserProgramAddress = (
  tagHash: Buffer,
  programId: web3.PublicKey
): Promise<[web3.PublicKey, number]> =>
  web3.PublicKey.findProgramAddress([Buffer.from('user'), tagHash], programId)

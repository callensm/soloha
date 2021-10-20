import { web3 } from '@project-serum/anchor'
import crc32 from 'crc-32'

/**
 * Create a `Buffer` from a CRC-32 hash to be used as an
 * `User` account seed for creation and validation.
 * @exports
 * @param {string} tag
 * @returns {Buffer}
 */
export const hashAuthorTag = (tag: string): Buffer => Buffer.from(crc32.str(tag).toString(16))

/**
 * Attempt to derive the public key and bump nonce for a
 * Discord user's `User` account on chain.
 * @param {web3.PublicKey} programId
 * @param {Buffer} tagHash
 * @returns {Promise<[web3.PublicKey, number]>}
 */
export const getUserAddressAndBump = (
  programId: web3.PublicKey,
  tagHash: Buffer
): Promise<[web3.PublicKey, number]> =>
  web3.PublicKey.findProgramAddress([Buffer.from('user'), tagHash], programId)

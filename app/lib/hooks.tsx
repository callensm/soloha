import { useEffect, useMemo, useState } from 'react'
import { useConnection, useWallet, AnchorWallet } from '@solana/wallet-adapter-react'
import { BN, Program, ProgramAccount, Provider, web3 } from '@project-serum/anchor'
import { Soloha } from './idl/soloha'
import idl from './idl/soloha.json'
import { getStateProgramAddress, getUserProgramAddress, hashDiscordTag } from './util'
import { notifyStateFetchError, notifyUserFetchError } from './notifications'

const PROGRAM_ID: string = 'LHAPYTbqXFzkNxojt16Mx5gtAnnbhkZfMyLvU9xsKVe'

type GlobalState = {
  highestStreak: number
  highestStreakOwner: web3.PublicKey
  registered: BN
  bump: number[]
}

type User = {
  bump: number[]
  lastGm: BN
  owner: web3.PublicKey
  streak: number
  total: number
}

/**
 * Custom React hook to provide the Anchor program
 * instance to any component.
 * @returns {Program<Soloha>}
 */
export const useAnchor = (): Program<Soloha> => {
  const { connection } = useConnection()
  const wallet = useWallet()

  return useMemo(() => {
    const provider = new Provider(connection, wallet as AnchorWallet, {})
    return new Program<Soloha>(idl as any, PROGRAM_ID, provider)
  }, [connection, wallet])
}

/**
 * Custom React hook to provide the possible state
 * of the authenticated discord user's on-chain
 * `User` PDA account.
 * @param {string | undefined} tag
 * @returns {ProgramAccount<User> | null}
 */
export const useUser = (tag?: string): ProgramAccount<User> | null => {
  const program = useAnchor()

  const [userKey, setUserKey] = useState<web3.PublicKey | null>(null)
  const [user, setUser] = useState<ProgramAccount<User> | null>(null)

  useEffect(() => {
    if (!tag) return

    getUserProgramAddress(hashDiscordTag(tag), program.programId)
      .then(([key]: [web3.PublicKey, number]) => setUserKey(key))
      .catch(console.error)
  }, [program, tag])

  useEffect(() => {
    if (!userKey) return

    program.account.user
      .fetchNullable(userKey)
      .then(u => {
        if (u) {
          setUser({ account: u as User, publicKey: userKey })
        }
      })
      .catch(notifyUserFetchError)
  }, [program, userKey])

  return user
}

export const useGlobalState = (): ProgramAccount<GlobalState> | null => {
  const program = useAnchor()

  const [stateKey, setStateKey] = useState<web3.PublicKey | null>(null)
  const [state, setState] = useState<ProgramAccount<GlobalState> | null>(null)

  useEffect(() => {
    if (stateKey) return
    getStateProgramAddress(program.programId)
      .then(addr => setStateKey(addr[0]))
      .catch(console.error)
  }, [program, stateKey])

  useEffect(() => {
    if (!stateKey) return
    program.account.state
      .fetch(stateKey)
      .then(s => setState({ account: s as GlobalState, publicKey: stateKey }))
      .catch(err => {
        console.log(err)
        notifyStateFetchError(err)
      })
  }, [stateKey])

  return state
}

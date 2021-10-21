import { useEffect, useMemo, useState } from 'react'
import { notification } from 'antd'
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react'
import { BN, Program, ProgramAccount, Provider, Wallet, web3 } from '@project-serum/anchor'
import { getStateProgramAddress, getUserProgramAddress, hashDiscordTag } from './util'
import idl from './soloha.json'

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
 * @returns {Program<any>}
 */
export const useAnchor = (): Program<any> => {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  return useMemo(() => {
    const provider = new Provider(connection, wallet as Wallet, {})
    return new Program(idl as any, (idl as any).metadata.address, provider)
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
      .catch(err => {
        notification.error({
          message: 'User Fetch Error',
          description: (err as Error).message,
          placement: 'bottomLeft',
          duration: 20
        })
      })
  }, [program, userKey])

  return user
}

export const useGlobalState = (): ProgramAccount<GlobalState> | null => {
  const program = useAnchor()

  const [stateKey, setStateKey] = useState<web3.PublicKey | null>(null)
  const [state, setState] = useState<ProgramAccount<GlobalState> | null>(null)

  useEffect(() => {
    getStateProgramAddress(program.programId)
      .then(([key]: [web3.PublicKey, number]) => setStateKey(key))
      .catch(console.error)
  }, [program])

  useEffect(() => {
    if (!stateKey) return

    program.account.state
      .fetch(stateKey)
      .then(s => setState({ account: s as GlobalState, publicKey: stateKey }))
      .catch(err => {
        notification.error({
          message: 'State Fetch Error',
          description: (err as Error).message,
          placement: 'bottomLeft',
          duration: 20
        })
      })
  }, [program, stateKey])

  return state
}

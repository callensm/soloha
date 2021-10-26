import {
  createContext,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import { IdlAccounts, ProgramAccount, web3 } from '@project-serum/anchor'
import { Soloha } from '../idl/soloha'
import { getUserProgramAddress, hashDiscordTag } from '../util'
import { notifyUserFetchError } from '../notifications'
import { useProgram } from './program'

export type User = IdlAccounts<Soloha>['user']

export interface UserContextState {
  tag: string | null
  user: ProgramAccount<User> | null
  setTag: Dispatch<SetStateAction<string | null>>
}

export const UserContext = createContext<UserContextState>({} as UserContextState)

export const UserProvider: FunctionComponent = ({ children }) => {
  const { program } = useProgram()

  const [tag, setTag] = useState<string | null>(null)
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

  return <UserContext.Provider value={{ tag, user, setTag }}>{children}</UserContext.Provider>
}

/**
 * Custom React hook to provide the possible state
 * of the authenticated discord user's on-chain
 * `User` PDA account.
 * @returns {UserContextState}
 */
export const useUser = (): UserContextState => {
  return useContext(UserContext)
}

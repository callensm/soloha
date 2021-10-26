import { createContext, FunctionComponent, useContext, useEffect, useState } from 'react'
import { IdlAccounts, ProgramAccount } from '@project-serum/anchor'
import { Soloha } from '../idl/soloha'
import { getStateProgramAddress } from '../util'
import { notifyStateFetchError } from '../notifications'
import { useProgram } from './program'

export type GlobalState = IdlAccounts<Soloha>['state']

export interface GlobalStateContextState {
  state: ProgramAccount<GlobalState> | null
}

export const GlobalStateContext = createContext<GlobalStateContextState>(
  {} as GlobalStateContextState
)

export const GlobalStateProvider: FunctionComponent = ({ children }) => {
  const { program } = useProgram()

  const [state, setState] = useState<ProgramAccount<GlobalState> | null>(null)

  useEffect(() => {
    getStateProgramAddress(program.programId)
      .then(addr => addr[0])
      .then(async stateKey => {
        const acc = await program.account.state.fetch(stateKey)
        return { account: acc as GlobalState, publicKey: stateKey }
      })
      .then(setState)
      .catch(notifyStateFetchError)
  }, [program])

  return <GlobalStateContext.Provider value={{ state }}>{children}</GlobalStateContext.Provider>
}

/**
 * Custom React hook to supply the on-chain global state
 * account data where needed
 * @returns {GlobalStateContextState}
 */
export const useGlobalState = (): GlobalStateContextState => {
  return useContext(GlobalStateContext)
}

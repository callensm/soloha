import { createContext, FunctionComponent, useContext, useMemo } from 'react'
import { Program, Provider } from '@project-serum/anchor'
import { AnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Soloha } from '../idl/soloha'
import idl from '../idl/soloha.json'

export const PROGRAM_ID: string = 'LHAPYTbqXFzkNxojt16Mx5gtAnnbhkZfMyLvU9xsKVe'

export interface ProgramContextState {
  program: Program<Soloha>
}

export const ProgramContext = createContext<ProgramContextState>({} as ProgramContextState)

export const ProgramProvider: FunctionComponent = ({ children }) => {
  const { connection } = useConnection()
  const wallet = useWallet()

  const program = useMemo(() => {
    const provider = new Provider(connection, wallet as AnchorWallet, {})
    return new Program<Soloha>(idl as any, PROGRAM_ID, provider)
  }, [connection, wallet])

  return <ProgramContext.Provider value={{ program }}>{children}</ProgramContext.Provider>
}

/**
 * Custom React hook for the `anchor.Program` context state
 * @returns {ProgramContextState}
 */
export const useProgram = (): ProgramContextState => {
  return useContext(ProgramContext)
}

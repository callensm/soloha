import { useMemo } from 'react'
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react'
import { Program, Provider, Wallet } from '@project-serum/anchor'
import idl from './ahoy.json'

export const useAnchor = () => {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  return useMemo(() => {
    const provider = new Provider(connection, wallet as Wallet, {})
    return new Program(idl as any, (idl as any).metadata.address, provider)
  }, [connection, wallet])
}

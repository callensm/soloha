import { FunctionComponent, useMemo } from 'react'
import { web3 } from '@project-serum/anchor'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import {
  Wallet,
  getPhantomWallet,
  getLedgerWallet,
  getSolletWallet,
  getSlopeWallet
} from '@solana/wallet-adapter-wallets'

const supportedWallets: Wallet[] = [
  getPhantomWallet(),
  getLedgerWallet(),
  getSolletWallet(),
  getSlopeWallet()
]

const WalletConnectionProvider: FunctionComponent = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => web3.clusterApiUrl(network), [network])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={supportedWallets}>{children}</WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletConnectionProvider

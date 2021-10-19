import { StrictMode } from 'react'
import { render } from 'react-dom'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import {
  getPhantomWallet,
  getLedgerWallet,
  getSolletWallet,
  getSlopeWallet,
  Wallet
} from '@solana/wallet-adapter-wallets'
import App from './App'

import '@solana/wallet-adapter-react-ui/styles.css'
import './custom-styles.less'

const enabledWallets: Wallet[] = [
  getPhantomWallet(),
  getLedgerWallet(),
  getSolletWallet(),
  getSlopeWallet()
]

render(
  <StrictMode>
    <ConnectionProvider endpoint={'http://127.0.0.1:8899'}>
      <WalletProvider wallets={enabledWallets}>
        <App />
      </WalletProvider>
    </ConnectionProvider>
  </StrictMode>,
  document.getElementById('root')
)

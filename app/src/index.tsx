import { StrictMode } from 'react'
import { render } from 'react-dom'
import { notification } from 'antd'
import { WalletError } from '@solana/wallet-adapter-base'
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

const onWalletError = (err: WalletError) => {
  notification.error({
    message: 'Wallet Connection Error',
    description: err.message,
    placement: 'bottomLeft'
  })
}

render(
  <StrictMode>
    <ConnectionProvider endpoint={'http://127.0.0.1:8899'}>
      <WalletProvider wallets={enabledWallets} onError={onWalletError}>
        <App />
      </WalletProvider>
    </ConnectionProvider>
  </StrictMode>,
  document.getElementById('root')
)

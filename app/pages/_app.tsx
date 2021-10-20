import type { FunctionComponent } from 'react'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'

import '@solana/wallet-adapter-react-ui/styles.css'
import 'antd/dist/antd.dark.css'
import '../styles/custom-styles.css'

const DynamicWalletConnectionProvider = dynamic(
  () => import('../components/WalletConnectionProvider'),
  {
    ssr: false
  }
)

const AhoyApp: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <DynamicWalletConnectionProvider>
      <Component {...pageProps} />
    </DynamicWalletConnectionProvider>
  )
}

export default AhoyApp
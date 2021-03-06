import type { FunctionComponent } from 'react'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { Provider as SessionProvider } from 'next-auth/client'
import { GlobalStateProvider, ProgramProvider, UserProvider } from '../lib/hooks'

import '@solana/wallet-adapter-react-ui/styles.css'
import '../styles/custom-styles.less'

const DynamicWalletConnectionProvider = dynamic(
  () => import('../components/WalletConnectionProvider'),
  {
    ssr: false
  }
)

const SolohaApp: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <DynamicWalletConnectionProvider>
      <ProgramProvider>
        <GlobalStateProvider>
          <UserProvider>
            <SessionProvider session={pageProps.session}>
              <Component {...pageProps} />
            </SessionProvider>
          </UserProvider>
        </GlobalStateProvider>
      </ProgramProvider>
    </DynamicWalletConnectionProvider>
  )
}

export default SolohaApp

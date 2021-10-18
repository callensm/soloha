import { CSSProperties, FunctionComponent, useEffect, useMemo, useState } from 'react'
import { Divider, Layout, Typography } from 'antd'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { ProgramAccount, web3 } from '@project-serum/anchor'
import Header from './components/Header'
import Enrollment from './components/Enrollment'
import { useAnchor } from './context/anchor'

const { Content } = Layout

const App: FunctionComponent = () => {
  const { publicKey, ready } = useWallet()
  const program = useAnchor()

  const [anchorite, setAnchorite] = useState<ProgramAccount | undefined>(undefined)

  useEffect(() => {
    if (!publicKey || !ready) return

    web3.PublicKey.findProgramAddress(
      [Buffer.from('anchorite'), publicKey.toBytes()],
      program.programId
    )
      .then(([key]) => program.account.anchorite.fetchNullable(key))
      .then((acc: any | null) => {
        if (acc) {
          setAnchorite(acc)
        }
      })
      .catch(console.error)
  }, [program, publicKey, ready])

  const modalLogo = useMemo(
    () => <img src="/anchor_logo.png" alt="anchor-logo" height="100%" />,
    []
  )

  return (
    <>
      <Layout>
        <WalletModalProvider logo={modalLogo} featuredWallets={5}>
          <Header />
        </WalletModalProvider>
        <Content style={contentStyle}>
          <Typography.Title>Ahoy!</Typography.Title>
          <Typography.Title level={3} style={{ marginTop: 0 }}>
            Saying "gm" goes a long way.
          </Typography.Title>
          <Divider />
          <Enrollment anchorite={anchorite} />
        </Content>
      </Layout>
    </>
  )
}

const contentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '10em'
}

export default App

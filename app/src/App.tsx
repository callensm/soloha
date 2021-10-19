import { CSSProperties, FunctionComponent, useEffect, useState } from 'react'
import { Layout, Typography } from 'antd'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { ProgramAccount } from '@project-serum/anchor'
import { CoffeeOutlined } from '@ant-design/icons'
import Header from './components/Header'
import Enrollment from './components/Enrollment'
import { useAnchor } from './lib/anchor'
import { getAnchoriteProgramAddress, hashAuthorTag } from './lib/util'

const { Content } = Layout

const App: FunctionComponent = () => {
  const { publicKey, ready } = useWallet()
  const program = useAnchor()

  const [anchorite, setAnchorite] = useState<ProgramAccount | undefined>(undefined)

  useEffect(() => {
    if (!publicKey || !ready) return

    getAnchoriteProgramAddress(hashAuthorTag('@synxe#6138'), program.programId)
      .then(([key]) => program.account.anchorite.fetchNullable(key))
      .then((acc: any | null) => {
        if (acc) {
          setAnchorite(acc)
        }
      })
      .catch(console.error)
  }, [program, publicKey, ready])

  return (
    <>
      <Layout>
        <WalletModalProvider
          logo={<img src="/anchor_logo.png" alt="anchor-logo" height="100%" />}
          featuredWallets={5}
        >
          <Header />
        </WalletModalProvider>
        <Content style={contentStyle}>
          <Typography.Title>
            Ahoy! <CoffeeOutlined />
          </Typography.Title>
          <Typography.Title level={3} style={{ marginTop: 0, marginBottom: '2em' }}>
            Make saying "gm" a little more meaningful.
          </Typography.Title>
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

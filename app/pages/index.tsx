import { CSSProperties, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Layout, Typography } from 'antd'
import { CoffeeOutlined } from '@ant-design/icons'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import type { ProgramAccount } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import Header from '../components/Header'
import Enrollment from '../components/Enrollment'
import { useAnchor } from '../lib/anchor'
import { getAnchoriteProgramAddress, hashAuthorTag } from '../lib/util'

const { Content } = Layout

const HomePage: NextPage = () => {
  const { publicKey, ready } = useWallet()
  const program = useAnchor()

  const [anchorite, setAnchorite] = useState<ProgramAccount | undefined>(undefined)

  useEffect(() => {
    if (!publicKey || !ready) return

    getAnchoriteProgramAddress(hashAuthorTag('synxe#6138'), program.programId)
      .then(([key]) => program.account.anchorite.fetchNullable(key))
      .then((acc: ProgramAccount['account'] | null) => setAnchorite(acc ?? undefined))
      .catch(console.error)
  }, [program, publicKey, ready])

  return (
    <>
      <Head>
        <title>Soloha ☕️</title>
        <meta name="description" content="Make saying gm a little more meaningful" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito&display=swap"
        />
      </Head>
      <Layout>
        <WalletModalProvider
          logo={<img src="/anchor_logo.png" alt="anchor-logo" height="100%" />}
          featuredWallets={5}
        >
          <Header />
        </WalletModalProvider>
        <Content style={contentStyle}>
          <Typography.Title>
            Soloha! <CoffeeOutlined />
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

export default HomePage

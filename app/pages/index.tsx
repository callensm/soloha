import React, { CSSProperties, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Divider, Layout, Typography } from 'antd'
import { CoffeeOutlined } from '@ant-design/icons'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { useSession } from 'next-auth/client'
import Header from '../components/Header'
import Enrollment from '../components/Enrollment'
import { useUser } from '../lib/hooks'
import StateTracker from '../components/StateTracker'

const { Content } = Layout

const HomePage: NextPage = () => {
  const { setTag } = useUser()
  const [session] = useSession()

  useEffect(() => setTag(session?.user?.name ?? null), [session, setTag])

  return (
    <>
      <Head>
        <title>Soloha ☕️</title>
      </Head>
      <Layout>
        <WalletModalProvider
          logo={<Image src="/anchor_logo.png" alt="anchor-logo" height="100%" width="100%" />}
          featuredWallets={5}
        >
          <Header />
        </WalletModalProvider>
        <Content style={contentStyle}>
          <Typography.Title>
            Soloha! <CoffeeOutlined />
          </Typography.Title>
          <Typography.Title level={3} style={{ marginTop: 0, marginBottom: '2em' }}>
            Make saying &quot;gm&quot; a little more meaningful.
          </Typography.Title>
          <Enrollment />
          <Divider />
          <StateTracker />
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

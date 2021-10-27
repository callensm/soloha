import React, { CSSProperties, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Divider, Layout, Space, Statistic, Typography } from 'antd'
import {
  CoffeeOutlined,
  DeploymentUnitOutlined,
  FireOutlined,
  UserOutlined
} from '@ant-design/icons'
import { web3 } from '@project-serum/anchor'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { useSession } from 'next-auth/client'
import Header from '../components/Header'
import Enrollment from '../components/Enrollment'
import { useGlobalState, useUser } from '../lib/hooks'
import { truncatePublicKey } from '../lib/util'

const { Content } = Layout

const HomePage: NextPage = () => {
  const { user, setTag } = useUser()
  const [session] = useSession()
  const { state } = useGlobalState()

  useEffect(() => setTag(session?.user?.name ?? null), [session])

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
          {state && (
            <Space size="large">
              {user && (
                <>
                  <Statistic
                    title="Your Streak"
                    prefix={<FireOutlined />}
                    value={user.account.streak}
                  />
                  <Statistic
                    title="Your Total"
                    prefix={<DeploymentUnitOutlined />}
                    value={user.account.total}
                  />
                </>
              )}
              <Statistic
                title="Highest Streak"
                prefix={<FireOutlined />}
                value={state.account.highestStreak}
              />
              <Statistic
                title="Highest Streak Owner"
                groupSeparator={''}
                prefix={<UserOutlined />}
                value={
                  state.account.highestStreakOwner.equals(web3.PublicKey.default)
                    ? 'None'
                    : truncatePublicKey(state.account.highestStreakOwner.toBase58())
                }
              />
            </Space>
          )}
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

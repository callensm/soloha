import { FunctionComponent } from 'react'
import { Space, Spin, Statistic } from 'antd'
import { DeploymentUnitOutlined, FireOutlined, UserOutlined } from '@ant-design/icons'
import { PublicKey } from '@solana/web3.js'
import { useGlobalState, useUser } from '../../lib/hooks'
import { truncatePublicKey } from '../../lib/util'

const StateTracker: FunctionComponent = () => {
  const { user } = useUser()
  const { state } = useGlobalState()

  return state ? (
    <Space size="large">
      <Statistic
        title="Your Streak"
        prefix={<FireOutlined />}
        value={user?.account.streak ?? '--'}
      />
      <Statistic
        title="Your Total"
        prefix={<DeploymentUnitOutlined />}
        value={user?.account.total ?? '--'}
      />
      <Statistic
        title="Top Global Streak"
        prefix={<FireOutlined />}
        value={state?.account.highestStreak}
      />
      <Statistic
        title="Top Global Streak Owner"
        groupSeparator={''}
        prefix={<UserOutlined />}
        value={
          state.account.highestStreakOwner.equals(PublicKey.default)
            ? 'None'
            : truncatePublicKey(state.account.highestStreakOwner.toBase58())
        }
      />
    </Space>
  ) : (
    <Spin />
  )
}

export default StateTracker

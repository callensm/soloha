import { CSSProperties, FunctionComponent } from 'react'
import { Layout, Space, Tag } from 'antd'
import ConnectButton from './ConnectButton'
import DiscordAuthentication from './DiscordAuthentication'

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = _props => {
  return (
    <Layout.Header style={headerStyle}>
      <Space size="large">
        <DiscordAuthentication />
        <ConnectButton />
        <Tag color="cyan">devnet</Tag>
      </Space>
    </Layout.Header>
  )
}

const headerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  backgroundColor: 'transparent'
}

export default Header

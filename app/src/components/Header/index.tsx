import { CSSProperties, FunctionComponent } from 'react'
import { Layout } from 'antd'
import ConnectButton from './ConnectButton'

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = _props => {
  return (
    <Layout.Header style={headerStyle}>
      <ConnectButton />
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

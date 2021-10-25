import { FunctionComponent, useCallback, useEffect, useMemo } from 'react'
import { Button, Space } from 'antd'
import { WalletOutlined } from '@ant-design/icons'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { notifyWalletConnectionStatus } from '../../lib/notifications'

interface ConnectButtonProps {}

const ConnectButton: FunctionComponent<ConnectButtonProps> = _props => {
  const modal = useWalletModal()
  const { wallet, disconnect, connect, publicKey, connected, connecting } = useWallet()

  useEffect(() => notifyWalletConnectionStatus(connected), [connected])

  const handleOpenModal = useCallback(() => modal.setVisible(true), [modal])

  const handleConnectToWallet = useCallback(async () => {
    if (!wallet) throw new WalletNotConnectedError()

    try {
      await connect()
    } catch (err) {
      console.error(err)
    }
  }, [wallet, connect])

  const handleResetWallet = useCallback(async () => {
    try {
      if (wallet) {
        await disconnect()
      }
    } catch (err) {
      console.error(err)
    }
  }, [wallet, disconnect])

  const walletIcon = useMemo(
    () => (
      <img
        id="wallet-btn-icon"
        src={wallet?.icon || ''}
        alt="wallet-icon"
        height="90%"
        width="90%"
      />
    ),
    [wallet]
  )

  return (
    <>
      {wallet ? (
        <Space>
          {publicKey && connected ? (
            <Button type="primary" icon={<WalletOutlined />}>
              {truncatePublicKey(publicKey.toBase58())}
            </Button>
          ) : (
            <Button
              style={{ display: 'flex' }}
              type="primary"
              icon={walletIcon}
              loading={connecting}
              onClick={handleConnectToWallet}
            >
              Connect
            </Button>
          )}
          <Button onClick={handleResetWallet}>Disconnect</Button>
        </Space>
      ) : (
        <Button type="primary" icon={<WalletOutlined />} onClick={handleOpenModal}>
          Select Wallet
        </Button>
      )}
    </>
  )
}

const truncatePublicKey = (key: string) => `${key.substr(0, 5)}...${key.substr(key.length - 5)}`

export default ConnectButton

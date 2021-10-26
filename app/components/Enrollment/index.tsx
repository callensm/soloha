import { CSSProperties, FunctionComponent, useCallback, useState } from 'react'
import { Avatar, Comment, Spin } from 'antd'
import { web3 } from '@project-serum/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import dayjs from 'dayjs'
import Coffee from './Coffee'
import { useProgram, useGlobalState, useUser } from '../../lib/hooks'
import { notifySolScan, notifyTransactionError } from '../../lib/notifications'
import { getUserProgramAddress, hashDiscordTag } from '../../lib/util'

const Enrollment: FunctionComponent = () => {
  const { program } = useProgram()
  const { state } = useGlobalState()
  const { tag, user } = useUser()
  const { publicKey, ready, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const [loading, setLoading] = useState<boolean>(false)

  const handleCoffeeClick = useCallback(async () => {
    if (!publicKey || !state || !tag) return

    setLoading(true)

    const tagHash = hashDiscordTag(tag)
    const tagArg = { value: [...tagHash] }
    const [userKey, userBump] = await getUserProgramAddress(tagHash, program.programId)

    let tx: web3.Transaction

    try {
      if (user) {
        tx = program.transaction.deregister(tagArg, {
          accounts: {
            owner: publicKey,
            state: state.publicKey,
            user: userKey
          }
        })
      } else {
        tx = program.transaction.register(tagArg, userBump, {
          accounts: {
            owner: publicKey,
            state: state.publicKey,
            user: userKey,
            systemProgram: web3.SystemProgram.programId
          }
        })
      }

      const sig = await sendTransaction(tx, connection)
      await connection.confirmTransaction(sig, 'confirmed')

      notifySolScan(sig, 'devnet')
    } catch (err) {
      notifyTransactionError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [tag, user, program, publicKey, sendTransaction, connection])

  return (
    <Spin spinning={loading}>
      <div style={containerStyle}>
        <Comment
          author="Espresso"
          avatar={<Avatar src="/anchor_logo.png" size="large" shape="circle" />}
          content="gm - react to my message to register or deregister"
          datetime={`Today at ${dayjs().format('h:mm A')}`}
          actions={[
            <Coffee
              key="coffee-tag"
              count={state?.account.registered.toString() ?? '?'}
              enabled={publicKey !== null && tag !== null && ready}
              isRegistered={user !== null}
              onClick={handleCoffeeClick}
            />
          ]}
        />
      </div>
    </Spin>
  )
}

const containerStyle: CSSProperties = {
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: 10,
  padding: '1em 3em 1em 3em'
}

export default Enrollment

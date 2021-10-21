import { CSSProperties, FunctionComponent, useCallback, useState } from 'react'
import { Avatar, Comment, notification, Spin } from 'antd'
import { web3, Context, ProgramAccount } from '@project-serum/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import dayjs from 'dayjs'
import Coffee from './Coffee'
import { useAnchor, useGlobalState } from '../../lib/hooks'
import { getUserProgramAddress, getStateProgramAddress, hashDiscordTag } from '../../lib/util'

interface EnrollmentProps {
  discordTag?: string
  user: ProgramAccount | null
}

const Enrollment: FunctionComponent<EnrollmentProps> = props => {
  const program = useAnchor()
  const state = useGlobalState()
  const { publicKey, ready, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const [loading, setLoading] = useState<boolean>(false)
  const [registeredCount, _setRegisteredCount] = useState<number>(
    state?.account.registered.toNumber() || 0
  )

  const handleCoffeeClick = useCallback(async () => {
    if (!publicKey || !props.discordTag) return

    setLoading(true)

    const [stateKey] = await getStateProgramAddress(program.programId)
    const tagHash = { value: hashDiscordTag(props.discordTag) }
    const [userKey, userBump] = await getUserProgramAddress(tagHash.value, program.programId)

    let tx: web3.Transaction

    try {
      if (props.user) {
        tx = program.transaction.deregister(tagHash, {
          accounts: {
            owner: publicKey,
            state: stateKey,
            user: userKey
          }
        } as Context)
      } else {
        tx = program.transaction.register(tagHash, userBump, {
          accounts: {
            owner: publicKey,
            state: stateKey,
            user: userKey,
            systemProgram: web3.SystemProgram.programId
          }
        } as Context)
      }

      const sig = await sendTransaction(tx, connection)
      await connection.confirmTransaction(sig, 'confirmed')

      displayExplorerNotification(sig)
    } catch (err) {
      displayTransactionError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [props.discordTag, props.user, program, publicKey, sendTransaction, connection])

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
              count={registeredCount}
              enabled={publicKey !== null && ready}
              isRegistered={props.user !== null}
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

/**
 * Display an Antd success notification with a link
 * to the transaction signature on Solana Explorer
 * @param {string} signature
 */
function displayExplorerNotification(signature: string) {
  notification.success({
    message: 'Transaction Success',
    description: (
      <a target="_blank" rel="noreferrer" href={`https://explorer.solana.com/tx/${signature}`}>
        View on Explorer
      </a>
    ),
    placement: 'bottomLeft',
    duration: 20
  })
}

/**
 * Display an Antd error notification with the
 * transaction error message for the user to see
 * @param {Error} err
 */
function displayTransactionError(err: Error) {
  notification.error({
    message: 'Transaction Error',
    description: (err as Error).message,
    placement: 'bottomLeft',
    duration: 20
  })
}

export default Enrollment

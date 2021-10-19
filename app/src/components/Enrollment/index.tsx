import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Avatar, Comment, notification, Spin } from 'antd'
import { web3, BN, Context, ProgramAccount } from '@project-serum/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import dayjs from 'dayjs'
import Coffee from './Coffee'
import { useAnchor } from '../../lib/anchor'
import { getAnchoriteProgramAddress, getStateProgramAddress, hashAuthorTag } from '../../lib/util'

interface EnrollmentProps {
  anchorite?: ProgramAccount
}

const Enrollment: FunctionComponent<EnrollmentProps> = props => {
  const program = useAnchor()
  const { publicKey, ready, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const [registeredCount, setRegisteredCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [listeners, setListeners] = useState<[number, number]>([-1, -1])

  useEffect(() => {
    getStateProgramAddress(program.programId)
      .then(([stateKey]) => program.account.ahoyState.fetch(stateKey))
      .then((state: any) => setRegisteredCount((state.registered as BN).toNumber()))
      .then(() => {
        const inc = program.addEventListener('NewAnchorite', _e =>
          setRegisteredCount(count => count + 1)
        )

        const dec = program.addEventListener('ClosedAnchorite', _e =>
          setRegisteredCount(count => count - 1)
        )

        setListeners([inc, dec])
      })
      .catch(err => {
        notification.error({
          message: 'Ahoy State Fetch Error',
          description: (err as Error).message,
          placement: 'bottomLeft',
          duration: 20
        })
      })

    return () => {
      program
        .removeEventListener(listeners[0])
        .then(() => program.removeEventListener(listeners[1]))
        .catch(console.error)
    }
  }, [program])

  const handleCoffeeClick = useCallback(async () => {
    if (!publicKey) return

    setLoading(true)

    const [stateKey] = await getStateProgramAddress(program.programId)

    const tagHash = { value: hashAuthorTag('synxe#6138') }
    const [anchoriteKey, anchoriteBump] = await getAnchoriteProgramAddress(
      tagHash.value,
      program.programId
    )

    let tx: web3.Transaction

    try {
      if (props.anchorite) {
        tx = program.transaction.deregister(tagHash, {
          accounts: {
            owner: publicKey,
            state: stateKey,
            anchorite: anchoriteKey
          }
        } as Context)
      } else {
        tx = program.transaction.register(tagHash, anchoriteBump, {
          accounts: {
            owner: publicKey,
            state: stateKey,
            anchorite: anchoriteKey,
            systemProgram: web3.SystemProgram.programId
          }
        } as Context)
      }

      const sig = await sendTransaction(tx, connection)
      await connection.confirmTransaction(sig, 'confirmed')

      notification.success({
        message: 'Transaction Success',
        description: (
          <a target="_blank" rel="noreferrer" href={`https://explorer.solana.com/tx/${sig}`}>
            View on Explorer
          </a>
        ),
        placement: 'bottomLeft',
        duration: 20
      })
    } catch (err) {
      notification.error({
        message: 'Transaction Error',
        description: (err as Error).message,
        placement: 'bottomLeft',
        duration: 20
      })
    } finally {
      setLoading(false)
    }
  }, [props.anchorite, program, publicKey, sendTransaction])

  return (
    <Spin spinning={loading}>
      <div
        style={{
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 10,
          padding: '1em 3em 1em 3em'
        }}
      >
        <Comment
          author="Captain"
          avatar={<Avatar src="/anchor_logo.png" size="large" shape="circle" />}
          content="gm - react to my message to register or deregister"
          datetime={`Today at ${dayjs().format('h:mm A')}`}
          actions={[
            <Coffee
              count={registeredCount}
              enabled={publicKey !== null && ready}
              isRegistered={props.anchorite !== undefined}
              onClick={handleCoffeeClick}
            />
          ]}
        />
      </div>
    </Spin>
  )
}

export default Enrollment

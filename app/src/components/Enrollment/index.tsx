import { FunctionComponent, useEffect, useState } from 'react'
import { Avatar, Comment } from 'antd'
import { web3, BN, ProgramAccount } from '@project-serum/anchor'
import dayjs from 'dayjs'
import Coffee from './Coffee'
import { useAnchor } from '../../context/anchor'

interface EnrollmentProps {
  anchorite?: ProgramAccount
}

const Enrollment: FunctionComponent<EnrollmentProps> = props => {
  const program = useAnchor()

  const [registeredCount, setRegisteredCount] = useState<number>(0)

  useEffect(() => {
    web3.PublicKey.findProgramAddress([Buffer.from('state')], program.programId)
      .then(([stateKey]) => program.account.ahoyState.fetch(stateKey))
      .then((state: any) => {
        setRegisteredCount((state.registered as BN).toNumber())
      })
      .catch(console.error)
  }, [program])

  return (
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
        content="gm"
        datetime={`Today at ${dayjs().format('h:mm A')}`}
        actions={[<Coffee count={registeredCount} isRegistered={props.anchorite !== undefined} />]}
      />
    </div>
  )
}

export default Enrollment

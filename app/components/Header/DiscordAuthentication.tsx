import { FunctionComponent } from 'react'
import { Avatar, Button } from 'antd'
import { signIn, useSession } from 'next-auth/client'

const DiscordAuthentication: FunctionComponent = () => {
  const [session] = useSession()

  return (
    <>
      {session && session.user ? (
        <Avatar src={session.user.image} alt="discord-pfp" />
      ) : (
        <Button
          type="primary"
          icon={<img id="discord-btn-icon" src="/discord_icon.svg" width={20} alt="discord-icon" />}
          onClick={() => signIn('discord')}
        >
          Discord Login
        </Button>
      )}
    </>
  )
}

export default DiscordAuthentication

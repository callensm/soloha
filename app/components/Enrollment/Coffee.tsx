import { CSSProperties, FunctionComponent, useMemo } from 'react'
import { Tag } from 'antd'

interface CoffeeProps {
  count: number
  enabled: boolean
  isRegistered: boolean
  onClick: () => void | Promise<void>
}

const Coffee: FunctionComponent<CoffeeProps> = props => {
  const style = useMemo(
    () =>
      ({
        cursor: props.enabled ? 'pointer' : 'not-allowed',
        fontSize: '1em',
        padding: '0.25em 0.75em',
        borderRadius: 10
      } as CSSProperties),
    [props.enabled]
  )

  return (
    <Tag style={style} onClick={props.onClick} color={props.isRegistered ? 'blue' : 'default'}>
      ☕️ {props.count}
    </Tag>
  )
}

export default Coffee

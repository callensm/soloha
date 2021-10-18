import { FunctionComponent } from 'react'
import { Tag } from 'antd'

interface CoffeeProps {
  count: number
  isRegistered: boolean
}

const Coffee: FunctionComponent<CoffeeProps> = props => {
  return <Tag color={props.isRegistered ? 'geekblue' : 'default'}>☕️ {props.count}</Tag>
}

export default Coffee

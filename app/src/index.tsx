import { StrictMode } from 'react'
import { render } from 'react-dom'
import App from './App'
import './custom-styles.less'

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)

import ReactDOM from 'react-dom'
import { initWallet } from './main.js'

// If dev enable window reload
if (process.env.NODE_ENV === 'development') {
  require('electron-css-reload')()
}

ReactDOM.render(initWallet(), document.getElementById('react-root'))

import ReactDOM from 'react-dom'
import { hostingPlugin } from './main.js'

// If dev enable window reload
if (process.env.NODE_ENV === 'development') {
  require('electron-css-reload')()
}

ReactDOM.render(hostingPlugin(), document.getElementById('react-root'))

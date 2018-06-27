import ReactDOM from 'react-dom'
import { logsPlugin } from './main.js'

// If dev enable window reload
if (process.env.NODE_ENV === 'development') {
  require('electron-css-reload')()
}

ReactDOM.render(logsPlugin(), document.getElementById('react-root'))

import AppView from '../components/app.js'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'

const mapStateToProps = state => ({
  showAllowanceDialog: state.files.get('showAllowanceDialog')
})

const App = connect(mapStateToProps)(AppView)
export default hot(module)(App)

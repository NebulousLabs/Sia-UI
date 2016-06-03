import AppView from '../components/app.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	unlocked: state.wallet.get('unlocked'),
})

const App = connect(mapStateToProps)(AppView)
export default App

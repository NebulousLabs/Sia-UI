import AppView from '../components/app.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	unlocked: state.wallet.get('unlocked'),
	showAllowanceDialog: state.files.get('showAllowanceDialog'),
})

const App = connect(mapStateToProps)(AppView)
export default App

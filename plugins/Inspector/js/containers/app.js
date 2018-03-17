import AppView from '../components/app.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	showAllowanceDialog: state.files.get('showAllowanceDialog'),
})

const App = connect(mapStateToProps)(AppView)
export default App

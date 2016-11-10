import LogViewView from '../components/logview.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	logText: state.get('logText'),
})

const LogView = connect(mapStateToProps)(LogViewView)
export default LogView


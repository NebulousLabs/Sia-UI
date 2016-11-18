import LogViewView from '../components/logview.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setScrolling, setNotScrolling, incrementLogSize } from '../actions.js'

const mapStateToProps = (state) => ({
	logText: state.get('logText'),
	scrolling: state.get('scrolling'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ setScrolling, setNotScrolling, incrementLogSize }, dispatch),
})

const LogView = connect(mapStateToProps, mapDispatchToProps)(LogViewView)
export default LogView


import CommandLineView from '../components/commandline.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showCommandOverview, hideCommandOverview } from '../actions/commandline.js'

const mapStateToProps = (state) => ({
	showCommandOverview: state.commandLineReducer.get('showCommandOverview'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showCommandOverview, hideCommandOverview }, dispatch),
})

const CommandLine = connect(mapStateToProps, mapDispatchToProps)(CommandLineView)
export default CommandLine

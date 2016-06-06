import CommandInputView from '../components/commandinput.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addCommand } from '../actions/commandline.js'

const mapStateToProps = () => ({
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ addCommand }, dispatch)
})

const CommandInput = connect(mapStateToProps, mapDispatchToProps)(CommandInputView)
export default CommandInput

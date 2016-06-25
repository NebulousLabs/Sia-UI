import ResizeDialogView from '../components/resizeDialog.js'
import { connect } from 'react-redux'
import { hideResizeDialog, updateModal } from '../actions/actions.js'
import { bindActionCreators } from 'redux'

const mapStateToProps = (state) => ({
	resizePath: state.modalReducer.get('resizePath'),
	resizeSize: state.modalReducer.get('resizeSize'),
	initialSize: state.modalReducer.get('initialSize'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideResizeDialog, updateModal }, dispatch),
})

const ResizeDialog = connect(mapStateToProps, mapDispatchToProps)(ResizeDialogView)
export default ResizeDialog

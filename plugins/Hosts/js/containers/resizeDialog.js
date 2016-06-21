import ResizeDialogView from '../components/resizeDialog.js'
import { connect } from 'react-redux'
import { hideResizeDialog, updateModal } from '../actions/actions.js'
import { bindActionCreators } from 'redux'

const mapStateToProps = (state) => ({
	shouldShowResizeDialog: state.hostingReducer.get('modals').get('shouldShowResizeDialog'),
	resizePath: state.hostingReducer.get('modals').get('resizePath'),
	resizeSize: state.hostingReducer.get('modals').get('resizeSize'),
	initialSize: state.hostingReducer.get('modals').get('initialSize'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideResizeDialog, updateModal }, dispatch),
})

const ResizeDialog = connect(mapStateToProps, mapDispatchToProps)(ResizeDialogView)
export default ResizeDialog

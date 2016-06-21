import WarningModalView from '../components/warningmodal.js'
import { connect } from 'react-redux'
import { hideWarningModal } from '../actions/actions.js'
import { bindActionCreators } from 'redux'

const mapStateToProps = (state) => ({
	shouldShow: state.hostingReducer.get('modals').get('shouldShowWarningModal'),
	title: state.hostingReducer.get('modals').get('warningModalTitle'),
	message: state.hostingReducer.get('modals').get('warningModalMessage'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideModal: hideWarningModal }, dispatch),
})

const WarningModal = connect(mapStateToProps, mapDispatchToProps)(WarningModalView)
export default WarningModal

import AnnounceDialogView from '../components/announce.js'
import { connect } from 'react-redux'
import { hideAnnounceDialog, updateModal } from '../actions/actions.js'
import { bindActionCreators } from 'redux'

const mapStateToProps = (state) => ({
	shouldShowAnnounceDialog: state.modalReducer.get('shouldShowAnnounceDialog'),
	announceAddress: state.modalReducer.get('announceAddress'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideAnnounceDialog, updateModal }, dispatch),
})

const AnnounceDialog = connect(mapStateToProps, mapDispatchToProps)(AnnounceDialogView)
export default AnnounceDialog

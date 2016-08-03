import ConfirmationDialogView from '../components/confirmationdialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hideConfirmationDialog } from '../actions/wallet.js'

const mapStateToProps = () => ({
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideConfirmationDialog }, dispatch),
})

const ConfirmationDialog = connect(mapStateToProps, mapDispatchToProps)(ConfirmationDialogView)
export default ConfirmationDialog

import AllowanceDialogView from '../components/allowancedialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { closeAllowanceDialog, setAllowance } from '../actions/files.js'

const mapStateToProps = (state) => ({
	unlocked: state.wallet.get('unlocked'),
	allowance: state.files.get('allowance'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ closeAllowanceDialog, setAllowance }, dispatch),
})

const AllowanceDialog = connect(mapStateToProps, mapDispatchToProps)(AllowanceDialogView)
export default AllowanceDialog

import AllowanceDialogView from '../components/allowancedialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { closeAllowanceDialog, calculateStorageCost, setAllowance } from '../actions/files.js'

const mapStateToProps = (state) => ({
	unlocked: state.wallet.get('unlocked'),
	storageSize: state.allowancedialog.get('storageSize'),
	storageCost: state.allowancedialog.get('storageCost'),
	allowanceProgress: state.allowancedialog.get('allowanceProgress'),
	settingAllowance: state.allowancedialog.get('settingAllowance'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ closeAllowanceDialog, calculateStorageCost, setAllowance }, dispatch),
})

const AllowanceDialog = connect(mapStateToProps, mapDispatchToProps)(AllowanceDialogView)
export default AllowanceDialog

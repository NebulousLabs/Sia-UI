import BackupButtonView from '../components/backupbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showBackupPrompt } from '../actions/wallet.js'

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showBackupPrompt }, dispatch),
})

const BackupButton = connect(mapStateToProps, mapDispatchToProps)(
	BackupButtonView
)
export default BackupButton

import BackupPromptView from '../components/backupprompt.js'
import { hideBackupPrompt } from '../actions/wallet.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	primarySeed: state.wallet.get('primarySeed'),
	auxSeeds: state.wallet.get('auxSeeds'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideBackupPrompt }, dispatch),
})

const BackupPrompt = connect(mapStateToProps, mapDispatchToProps)(BackupPromptView)
export default BackupPrompt

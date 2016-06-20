import WalletUnlockView from '../components/walletmodal.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	shouldShowWalletUnlock: state.hostingReducer.get('modals').get('shouldShowWalletUnlock'),
})

const WalletUnlock = connect(mapStateToProps)(WalletUnlockView)
export default WalletUnlock




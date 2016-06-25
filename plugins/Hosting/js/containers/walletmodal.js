import WalletUnlockView from '../components/walletmodal.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	walletLocked: state.hostingReducer.get('walletLocked'),
})

const WalletUnlock = connect(mapStateToProps)(WalletUnlockView)
export default WalletUnlock

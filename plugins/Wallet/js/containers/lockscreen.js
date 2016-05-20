// lockscreen.js: Wallet plugin lock-screen container.
import LockScreenView from '../components/lockscreen.js';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
	unlocked: state.wallet.get('unlocked'),
	encrypted: state.wallet.get('encrypted'),
});

const LockScreen = connect(mapStateToProps)(LockScreenView);
export default LockScreen;

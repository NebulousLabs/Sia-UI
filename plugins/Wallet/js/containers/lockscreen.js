// lockscreen.js: Wallet plugin lock-screen container.
import LockScreenView from '../components/lockscreen.js';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({

});

const LockScreen = connect(mapStateToProps)(LockScreenView)
export default LockScreen

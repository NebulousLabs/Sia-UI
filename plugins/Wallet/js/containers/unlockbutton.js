// unlockbutton.js: Wallet plugin unlock button.
import UnlockButtonView from '../components/unlockbutton.js';
import { unlockWallet } from '../actions/locking.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = () => ({
});
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ unlockWallet }, dispatch),
});

const UnlockButton = connect(mapStateToProps, mapDispatchToProps)(UnlockButtonView)
export default UnlockButton

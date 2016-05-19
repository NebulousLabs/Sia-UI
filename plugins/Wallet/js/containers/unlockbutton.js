// unlockbutton.js: Wallet plugin unlock button.
import UnlockButtonView from '../components/unlockbutton.js';
import { startPasswordPrompt } from '../actions/wallet.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = () => ({
});
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ startPasswordPrompt }, dispatch),
});

const UnlockButton = connect(mapStateToProps, mapDispatchToProps)(UnlockButtonView)
export default UnlockButton

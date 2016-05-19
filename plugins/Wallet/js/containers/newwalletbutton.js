import NewWalletButtonView from '../components/newwalletbutton.js';
import { createNewWallet } from '../actions/locking.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const mapStateToProps = () => ({
});
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ createNewWallet }, dispatch),
})

const NewWalletButton = connect(mapStateToProps, mapDispatchToProps)(NewWalletButtonView)
export default NewWalletButton

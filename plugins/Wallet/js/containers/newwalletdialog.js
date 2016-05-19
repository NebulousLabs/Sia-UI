import NewWalletDialogView from '../components/newwalletdialog.js';
import { dismissNewWalletDialog } from '../actions/locking.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
	visible: state.newwalletdialog.get('visible'),
	password: state.newwalletdialog.get('password'),
	seed: state.newwalletdialog.get('seed'),
});
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ dismissNewWalletDialog }, dispatch),
});

const NewWalletDialog = connect(mapStateToProps, mapDispatchToProps)(NewWalletDialogView);
export default NewWalletDialog;

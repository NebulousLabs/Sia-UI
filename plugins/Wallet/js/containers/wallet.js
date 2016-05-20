import WalletView from '../components/wallet.js'l;
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
	confirmedbalance: state.wallet.get('confirmedbalance'),
	unconfirmedbalance: state.wallet.get('unconfirmedbalance'),
});

const Wallet = connect(mapStateToProps)(WalletView);
export default Wallet;

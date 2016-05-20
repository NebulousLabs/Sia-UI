import AddressListView from '../components/addresslist.js';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
	addresses: state.wallet.get('addresses'),
});

const AddressList = connect(mapStateToProps)(AddressListView);
export default AddressList;

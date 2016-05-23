import TransactionHistoryView from '../components/transactionhistory.js';
import { connect } from 'react-redux';

const mapStateToProps = () => ({

});

const TransactionHistory = connect(mapStateToProps)(TransactionHistoryView);
export default TransactionHistory;

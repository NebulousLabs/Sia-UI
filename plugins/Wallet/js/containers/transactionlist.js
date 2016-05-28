import TransactionListView from '../components/transactionlist.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	transactions: state.wallet.get('transactions'),
})

const TransactionList = connect(mapStateToProps)(TransactionListView)
export default TransactionList

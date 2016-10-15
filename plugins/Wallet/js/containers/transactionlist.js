import TransactionListView from '../components/transactionlist.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showMoreTransactions } from '../actions/wallet.js'

const mapStateToProps = (state) => ({
	transactions: state.wallet.get('transactions'),
	ntransactions: state.wallet.get('ntransactions'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showMoreTransactions }, dispatch),
})

const TransactionList = connect(mapStateToProps, mapDispatchToProps)(TransactionListView)
export default TransactionList

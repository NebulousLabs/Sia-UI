import TransactionListView from '../components/transactionlist.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showMoreTransactions, toggleFilter } from '../actions/wallet.js'

const mapStateToProps = (state) => ({
	filter: state.wallet.get('filter'),
	transactions: state.wallet.get('transactions'),
	ntransactions: state.wallet.get('ntransactions'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showMoreTransactions, toggleFilter }, dispatch),
})

const TransactionList = connect(mapStateToProps, mapDispatchToProps)(
	TransactionListView
)
export default TransactionList

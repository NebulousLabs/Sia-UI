import TransferListView from '../components/transferlist.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	transfers: state.files.get('transfers'),
})

const TransferList = connect(mapStateToProps)(TransferListView)
export default TransferList
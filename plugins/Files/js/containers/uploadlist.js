import TransferListView from '../components/transferlist.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	transfers: state.files.get('uploading'),
})

const UploadList = connect(mapStateToProps)(TransferListView)
export default UploadList

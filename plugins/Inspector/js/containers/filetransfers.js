import FileTransfersView from '../components/filetransfers.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getDownloads, clearDownloads, hideFileTransfers } from '../actions/files.js'

const mapStateToProps = (state) => ({
	uploads: state.files.get('uploading'),
	downloads: state.files.get('downloading'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ getDownloads, clearDownloads, hideFileTransfers }, dispatch),
})

const FileTransfers = connect(mapStateToProps, mapDispatchToProps)(FileTransfersView)
export default FileTransfers

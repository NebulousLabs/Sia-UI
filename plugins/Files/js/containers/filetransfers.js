import FileTransfersView from '../components/filetransfers.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hideFileTransfers } from '../actions/files.js'

const mapStateToProps = () => ({
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideFileTransfers }, dispatch),
})

const FileTransfers = connect(mapStateToProps, mapDispatchToProps)(FileTransfersView)
export default FileTransfers

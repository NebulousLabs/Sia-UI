import FileView from '../components/file.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadFile } from '../actions/files.js'

const mapStateToProps = (state) => ({
	filename: state.fileview.get('filename'),
	siapath: state.fileview.get('siapath'),
	filesize: state.fileview.get('filesize'),
	available: state.fileview.get('available'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ uploadFile }, dispatch),
})

const File = connect(mapStateToProps, mapDispatchToProps)(FileView)
export default File

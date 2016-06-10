import FileListView from '../components/filelist.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setPath, showFileView } from '../actions/files.js'

const mapStateToProps = (state) => ({
	files: state.files.get('files'),
	path: state.files.get('path'),
	showSearchField: state.files.get('showSearchField'),
}) 
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ setPath, showFileView }, dispatch),
})

const FileList = connect(mapStateToProps, mapDispatchToProps)(FileListView)
export default FileList

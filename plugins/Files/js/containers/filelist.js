import FileListView from '../components/filelist.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	files: state.files.get('files'),
})

const FileList = connect(mapStateToProps)(FileListView)
export default FileList

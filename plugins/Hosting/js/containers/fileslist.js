import FilesListView from '../components/fileslist.js'
import { connect } from 'react-redux'
import { addFolderAskPathSize, removeFolder, resizeFolder, updateFolderToRemove } from '../actions/actions.js'
import { bindActionCreators } from 'redux'

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ addFolderAskPathSize, removeFolder, resizeFolder, updateFolderToRemove }, dispatch),
})

const mapStateToProps = (state) => ({
	folders: state.hostingReducer.get('files'),
	folderPathToRemove: state.modalReducer.get('folderPathToRemove'),
})

const FilesList = connect(mapStateToProps, mapDispatchToProps)(FilesListView)
export default FilesList

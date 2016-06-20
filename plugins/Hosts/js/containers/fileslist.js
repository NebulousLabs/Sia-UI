import FilesListView from '../components/fileslist.js'
import { connect } from 'react-redux'
import { addFolderAskPathSize, removeFolder, resizeFolder } from '../actions/actions.js'
import { bindActionCreators } from 'redux'

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ addFolderAskPathSize, removeFolder, resizeFolder }, dispatch),
})

const mapStateToProps = (state) => ({
	acceptingContracts: state.hostingReducer.get("acceptingContracts"),
	folders: state.hostingReducer.get('files'),
})

const FilesList = connect(mapStateToProps, mapDispatchToProps)(FilesListView)
export default FilesList

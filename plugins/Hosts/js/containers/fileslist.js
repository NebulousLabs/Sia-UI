import FilesListView from '../components/fileslist.js'
import { connect } from 'react-redux'
import { addFolder, deleteFolder, resizeFolder } from '../actions/actions.js'
import { bindActionCreators } from 'redux'

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ addFolder, deleteFolder, resizeFolder }, dispatch),
})

const mapStateToProps = (state) => ({
    acceptingContracts: state.hostingReducer.get("acceptingContracts"),
    files: state.hostingReducer.get('files'),
})

const FilesList = connect(mapStateToProps, mapDispatchToProps)(FilesListView)
export default FilesList


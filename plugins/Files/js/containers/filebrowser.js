import FileBrowserView from '../components/filebrowser.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	activespending: state.files.get('activespending'),
	allocatedspending: state.files.get('allocatedspending'),
})

const FileBrowser = connect(mapStateToProps)(FileBrowserView)
export default FileBrowser

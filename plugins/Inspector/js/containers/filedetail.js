import FileDetailView from '../components/filedetail.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showFileDetail, closeFileDetail, fetchFileDetail } from '../actions/files.js'

const mapStateToProps = (state) => ({
	showDetailPath: state.files.get('showDetailPath'),
	showDetailFile: state.files.get('showDetailFile'),
	current: state.files.get('current'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showFileDetail, closeFileDetail, fetchFileDetail }, dispatch),
})

const FileDetail = connect(mapStateToProps, mapDispatchToProps)(FileDetailView)
export default FileDetail

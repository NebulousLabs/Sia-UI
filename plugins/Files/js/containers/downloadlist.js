import DownloadListView from '../components/downloadlist.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	downloads: state.files.get('downloads'),
})

const DownloadList = connect(mapStateToProps)(DownloadListView)
export default DownloadList

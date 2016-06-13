import DownloadListView from '../components/downloadlist.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	downloads: state.downloadlist.toList(),
})

const DownloadList = connect(mapStateToProps)(DownloadListView)
export default DownloadList

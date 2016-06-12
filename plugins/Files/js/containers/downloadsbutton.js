import DownloadsButtonView from '../components/downloadsbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toggleDownloadList } from '../actions/files.js'

const mapStateToProps = () => ({
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ toggleDownloadList }, dispatch),
})

const DownloadsButton = connect(mapStateToProps, mapDispatchToProps)(DownloadsButtonView)
export default DownloadsButton

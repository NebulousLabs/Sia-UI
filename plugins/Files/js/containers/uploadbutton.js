import UploadButtonView from '../components/uploadbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showUploadDialog } from '../actions/files.js'

const mapStateToProps = (state) => ({
	contracts: state.files.get('contractCount'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showUploadDialog }, dispatch),
})

const UploadButton = connect(mapStateToProps, mapDispatchToProps)(UploadButtonView)
export default UploadButton

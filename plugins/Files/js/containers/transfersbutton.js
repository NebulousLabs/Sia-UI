import TransfersButtonView from '../components/transfersbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showFileTransfers } from '../actions/files.js'

const mapStateToProps = () => ({
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showFileTransfers }, dispatch),
})

const TransfersButton = connect(mapStateToProps, mapDispatchToProps)(TransfersButtonView)
export default TransfersButton

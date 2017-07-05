import AddFolderButtonView from '../components/addfolderbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAddFolderDialog } from '../actions/files.js'

const mapStateToProps = () => ({
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showAddFolderDialog }, dispatch),
})

const AddFolderButton = connect(mapStateToProps, mapDispatchToProps)(AddFolderButtonView)
export default AddFolderButton 

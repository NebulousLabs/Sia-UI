import EditModalView from '../components/edit.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
    usersettings: state.hostingReducer.get('usersettings'),
})

const EditModal = connect(mapStateToProps)(EditModalView)
export default EditModal


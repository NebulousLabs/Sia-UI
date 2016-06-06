import SetAllowanceButtonView from '../components/setallowancebutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAllowanceDialog } from '../actions/files.js'

const mapStateToProps = () => ({
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showAllowanceDialog }, dispatch),
})

const SetAllowanceButton = connect(mapStateToProps, mapDispatchToProps)(SetAllowanceButtonView)
export default SetAllowanceButton

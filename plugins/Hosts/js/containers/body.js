import BodyView from '../components/body.js'
import { connect } from 'react-redux'
import { updateSetting, toggleAcceptingContracts, resetHost } from '../actions/actions.js'
import { bindActionCreators } from 'redux'

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ updateSetting, toggleAcceptingContracts, resetHost }, dispatch),
})

const mapStateToProps = (state) => ({
    usersettings: state.hostingReducer.get('usersettings'),
    starthosting: state.hostingReducer.get("starthosting"),
    acceptingContracts: state.hostingReducer.get("acceptingContracts"),
})

const Body = connect(mapStateToProps, mapDispatchToProps)(BodyView)
export default Body

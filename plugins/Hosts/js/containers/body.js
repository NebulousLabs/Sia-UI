import BodyView from '../components/body.js'
import { connect } from 'react-redux'
import { updateSetting, updateSettings, toggleAcceptingContracts, resetHost } from '../actions/actions.js'
import { bindActionCreators } from 'redux'

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ updateSetting, updateSettings, toggleAcceptingContracts, resetHost }, dispatch),
})

const mapStateToProps = (state) => ({
    usersettings: state.hostingReducer.get('usersettings'),
    defaultsettings: state.hostingReducer.get('defaultsettings'),
    starthosting: state.hostingReducer.get("starthosting"),
    acceptingContracts: state.hostingReducer.get("acceptingContracts"),
    files: state.hostingReducer.get('files'),
})

const Body = connect(mapStateToProps, mapDispatchToProps)(BodyView)
export default Body

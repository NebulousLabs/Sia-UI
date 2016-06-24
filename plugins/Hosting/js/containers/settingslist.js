import SettingsListView from '../components/settingslist.js'
import { connect } from 'react-redux'
import { updateSetting, updateSettings, showToggleAcceptingModal, hideToggleAcceptingModal } from '../actions/actions.js'
import { bindActionCreators } from 'redux'

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ updateSetting, updateSettings, showToggleAcceptingModal, hideToggleAcceptingModal }, dispatch),
})

const mapStateToProps = (state) => ({
	usersettings: state.hostingReducer.get('usersettings'),
	defaultsettings: state.hostingReducer.get('defaultsettings'),
	acceptingContracts: state.hostingReducer.get('acceptingContracts'),
	settingsChanged: state.hostingReducer.get('settingsChanged'),
	shouldShowToggleAcceptingModal: state.hostingReducer.get('modals').get('shouldShowToggleAcceptingModal'),
})

const SettingsList = connect(mapStateToProps, mapDispatchToProps)(SettingsListView)
export default SettingsList

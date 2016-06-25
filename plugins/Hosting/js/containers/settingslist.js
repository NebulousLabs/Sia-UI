import SettingsListView from '../components/settingslist.js'
import { connect } from 'react-redux'
import { showToggleAcceptingModal, hideToggleAcceptingModal, updateSettings, pushSettings } from '../actions/actions.js'
import { bindActionCreators } from 'redux'
import { Map } from 'immutable'

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		showToggleAcceptingModal,
		hideToggleAcceptingModal,
		updateSettings,
		pushSettings,
	}, dispatch),
})

const mapStateToProps = (state) => ({
	usersettings: Map({
		maxduration: Map({
			name:'Max Duration (Weeks)',
			value: state.settingsReducer.get('maxduration'),
			min: 12,
		}),
		collateral: Map({
			name: 'Collateral per TB per Month (SC)',
			value: state.settingsReducer.get('collateral'),
		}),
		storageprice: Map({
			name: 'Price per TB per Month (SC)',
			value: state.settingsReducer.get('storageprice'),
		}),
		downloadbandwidthprice: Map({
			name: 'Bandwidth Price (SC/TB)',
			value: state.settingsReducer.get('downloadbandwidthprice'),
		}),
	}),
	acceptingContracts: state.settingsReducer.get('acceptingContracts'),
	settingsChanged: state.settingsReducer.get('settingsChanged'),
	defaultsettings: state.settingsReducer.get('defaultsettings'),
	shouldShowToggleAcceptingModal: state.modalReducer.get('shouldShowToggleAcceptingModal'),
})

const SettingsList = connect(mapStateToProps, mapDispatchToProps)(SettingsListView)
export default SettingsList

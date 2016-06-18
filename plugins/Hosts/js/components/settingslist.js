import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import * as helper from '../utils/host.js'

const SettingsList = ({ acceptingContracts, usersettings, defaultsettings, settingsChanged, actions }) => {
	const announceHost = () => null

	const handleSettingInput = (e) => actions.updateSetting(e.target.attributes.getNamedItem("data-setting").value, e.target.value)
	const updateSettings = () => actions.updateSettings(Map({ acceptingContracts, usersettings } ))
	const resetSettings = () => actions.updateSettings(Map({ acceptingContracts, usersettings: defaultsettings } ))

	const HostProperties = usersettings.map((setting, key) => (
		<div className="property pure-g" key={ key }>
			<div className="pure-u-2-3">
				<div className="name">{ setting.get("name") }</div>
			</div>
			<div className="pure-u-1-3">
				<div className="value">
					<input type="number" data-setting={ setting.get("name") } onChange={ handleSettingInput } className="value" value={ setting.get("value") }></input>
				</div>
			</div>
		</div>
	)).toList()

	return (
		<div className="settings section">
			<div className="property row">
  				<div className="title"></div>
				<div className="controls">
					<div className={ 'button' + ( settingsChanged ? '' : ' disable' ) } onClick={ updateSettings }>
						<i className='fa fa-save'></i>
						&nbsp;Save
					</div>
					<div className='button' onClick={ resetSettings }>
						<i className='fa fa-refresh'></i>
						&nbsp;Reset
					</div>
				</div>
			</div>
			{ HostProperties }
		</div>
	)
}

export default SettingsList

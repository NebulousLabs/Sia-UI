import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import * as helper from '../utils/host.js'

const SettingsList = ({ acceptingContracts, usersettings, defaultsettings, settingsChanged, actions }) => {

	const handleSettingInput = (e) => {
		if (e.target.value >= 0){
			actions.updateSetting(e.target.attributes.getNamedItem('data-setting').value, e.target.value)
		}
	}

	const updateSettings = () => actions.updateSettings(Map({ acceptingContracts, usersettings } ))
	const resetSettings = () => actions.updateSettings(Map({ acceptingContracts, usersettings: defaultsettings } ))
	const announceHost = () => null
	const toggleAcceptingContracts = () => actions.updateSettings(Map({ acceptingContracts: !acceptingContracts, usersettings }))

	const HostProperties = usersettings.map((setting, key) => (
		<div className='property pure-g' key={ key }>
			<div className='pure-u-1-2'>
				<div className='name'>{ setting.get('name') }</div>
			</div>
			<div className='pure-u-1-2'>
				<div className='value'>
					<input type='number' data-setting={ setting.get('name') } onChange={ handleSettingInput } className='value' value={ setting.get('value') }></input>
				</div>
			</div>
			<div className={ 'error pure-g' + ( setting.get('name') < 0 ? '' : ' hidden' ) }>
				<span>Must be a number greater than zero.</span>
			</div>
		</div>
	)).toList()

	return (
		<div className='settings section'>
			<div className='property row'>
  				<div className='title'>Configurations</div>
				<div className='controls'>
					<div className='button' id='announce' onClick={ announceHost }>
						<i className='fa fa-bullhorn'></i>
						Announce
					</div>
					<div className={ 'button' + ( settingsChanged ? '' : ' disable' ) } onClick={ updateSettings }>
						<i className='fa fa-save'></i>
						Save
					</div>
					<div className='button' onClick={ resetSettings }>
						<i className='fa fa-refresh'></i>
						Reset
					</div>
				</div>
			</div>
			{ HostProperties }

			<div className='property pure-g'>
				<div className='pure-u-1-2'>
					<div className='name'>Accepting Contracts</div>
				</div>
				<div className='pure-u-1-2'>
					<div className='value'>
						<div className={ 'toggle-switch' + (acceptingContracts ? '' : ' off') } onClick={ toggleAcceptingContracts }>
							<div className='toggle-inner'></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SettingsList

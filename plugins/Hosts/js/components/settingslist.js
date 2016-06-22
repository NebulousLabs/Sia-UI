import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import * as helper from '../utils/host.js'

const SettingsList = ({ acceptingContracts, usersettings, defaultsettings, settingsChanged, actions }) => {

	const handleSettingInput = (e) => {
		if (e.target.value >= 0){
			actions.updateSetting(e.target.attributes.getNamedItem('data-setting').value, e.target.value)
		}
	}

	const updateSettings = () => {
		if (helper.validNumbers(usersettings.map((val) => ({ val: val.get('value'), min: val.get('min') || 0 })).toArray()))
			actions.updateSettings(Map({ acceptingContracts, usersettings } ))
	}

	const saveEnabled = () => (
		helper.validNumbers(usersettings.map((val) => ({ val: val.get('value'), min: val.get('min') || 0 })).toArray()) && settingsChanged
	)

	const resetSettings = () => actions.updateSettings(Map({ acceptingContracts, usersettings: defaultsettings } ))
	const announceHost = () => null
	const toggleAcceptingContracts = () => {
		if (!acceptingContracts){
			actions.showWarning(
				Map({ title: 'Start accepting contracts?', message: 'To host files you must keep the Sia-UI open. Collateral will also be locked' +
					' and you will be unable to spend that SC until the contract is expired.' }),
				() => actions.updateSettings(Map({ acceptingContracts: !acceptingContracts, usersettings }))
			)
		}
		else {
			actions.showWarning(
				Map({ title: 'Stop accepting contracts?', message: 'You must still keep Sia-UI open until the exisitng contracts have expired otherwise you will lose collateral.' }),
				() => actions.updateSettings(Map({ acceptingContracts: !acceptingContracts, usersettings }))
			)
		}
	}

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
			<div className={ 'error pure-u-1-1' + ( setting.get('value') <= Number(setting.get('min'))  || isNaN(setting.get('value')) ? '' : ' hidden' ) }>
				<span>Must be a number greater than { setting.get('min') || 'zero' }.</span>
			</div>
		</div>
	)).toList()

	return (
		<div className='settings section'>
			<div className='property row'>
  				<div className='title'>Configurations</div>
				<div className='controls'>
					<div className={ 'button' + ( saveEnabled() ? '' : ' disable' ) } onClick={ updateSettings }>
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

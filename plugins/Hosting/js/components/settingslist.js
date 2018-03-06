import React from 'react'
import * as helper from '../utils/host.js'
import Modal from './warningmodal.js'

const SettingsList = ({ conversionRate, acceptingContracts, usersettings, defaultsettings, settingsChanged, shouldShowToggleAcceptingModal, actions }) => {

	const handleSettingInput = (e) => {
		if (e.target.value >= 0) {
			const settingToChange = e.target.attributes.getNamedItem('data-setting').value
			actions.updateSettings(usersettings.map( (setting, key) => (key === settingToChange) ? e.target.value : setting.get('value') ))
		}
	}

	const settingValues = (acceptcontracts, settings) => settings.map((setting) => setting.get('value')).set('acceptingContracts', acceptcontracts)
	const saveEnabled = () => helper.validNumbers(usersettings.toList().toJSON()) && settingsChanged
	const resetSettings = () => actions.pushSettings(defaultsettings.set('acceptingContracts', acceptingContracts))
	const updateSettings = () => {
		if ( saveEnabled() ) {
			actions.pushSettings(settingValues(acceptingContracts, usersettings))
		}
	}

	const showToggleAcceptingModal = () => actions.showToggleAcceptingModal()
	const hideToggleAcceptingModal = () => actions.hideToggleAcceptingModal()
	const toggleAcceptingContracts = () => {
		actions.pushSettings(settingValues(!acceptingContracts, usersettings))
		hideToggleAcceptingModal()
	}

	const HostProperties = usersettings.map((setting, key) => (
		<div className="property pure-g" key={key}>
			<div className="pure-u-1-2">
				<div className="name">{setting.get('name')}</div>
			</div>
			<div className="pure-u-1-2">
				<div className="value">
					<input type="number" data-setting={key} onChange={handleSettingInput} className="input" value={setting.get('value')} />
				</div>
			</div>
			<div className={'error pure-u-1-1' + ( setting.get('value') <= Number(setting.get('min') || 0)  || isNaN(setting.get('value')) ? '' : ' hidden' )}>
				<span>Must be a number greater than {setting.get('min') || 'zero'}.</span>
			</div>
		</div>
	)).toList()

	return (
		<div className="settings section">
			<div className="property row">
				<div className="title">Settings</div>
				<div className="controls">
					<div className={'button' + ( saveEnabled() ? '' : ' disable' )} onClick={updateSettings}>
						<i className="fa fa-save" />
						Save
					</div>
					<div className="button" onClick={resetSettings}>
						<i className="fa fa-refresh" />
						Reset
					</div>
				</div>
			</div>
			{HostProperties}

			<div className="property pure-g">
				<div className="pure-u-1-2">
					<div className="name">Accepting Contracts</div>
				</div>
				<div className="pure-u-1-2">
					<div className="value">
						<label className="toggle-switch">
							<input
								type="checkbox"
								checked={!!acceptingContracts}
								onClick={showToggleAcceptingModal}
							/>
							<span className="toggle-switch__inner"></span>
						</label>
					</div>
				</div>
			</div>
			<div className="property pure-g">
				<div className="pure-u-1-2">
					<div className="name">Conversion Rate</div>
				</div>
				<div className="pure-u-1-2">
					<div className="value">
						<div className="value">{conversionRate}%</div>
					</div>
				</div>
			</div>

			<Modal
				title="Stop accepting contracts?"
				message="You must still keep Sia-UI open until the existing contracts have expired otherwise you will lose collateral."
				open={
					shouldShowToggleAcceptingModal && acceptingContracts
				}
				actions={{ acceptModal: toggleAcceptingContracts, declineModal: hideToggleAcceptingModal  }}
				renderActions={({ handleAccept, handleDecline }) => (
					<React.Fragment>
						<input
							className="button button--mute button--tertiary cancel"
							type="button"
							value="Cancel"
							onClick={handleDecline}
						/>
						<input
							className="button button--primary button--danger accept"
							type="button"
							value="Stop Accepting Contracts"
							onClick={handleAccept}
						/>
					</React.Fragment>
				)}
			/>
			<Modal
				title="Start accepting contracts?"
				message="To host files you must keep the Sia-UI open. Collateral will also be locked and you will be unable to spend that SC until the contract is expired."
				actions={{ acceptModal: toggleAcceptingContracts, declineModal: hideToggleAcceptingModal  }}
				open={
					shouldShowToggleAcceptingModal && !acceptingContracts
				}
			/>
		</div>
	)
}

export default SettingsList

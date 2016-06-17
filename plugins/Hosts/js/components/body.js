import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import * as helper from '../utils/host.js'

const Body = ({ acceptingContracts, usersettings, defaultsettings, files, actions }) => {
	const announceHost = () => null

	const handleSettingInput = (e) => actions.updateSetting(e.target.attributes.getNamedItem("data-setting").value, e.target.value)
	//const handleFileInput = (e) => actions.updateSetting(e.target.attributes.getNamedItem("data-setting").value, e.target.value)
	const addStorageLocation = (e) => actions.addFile(helper.chooseFileLocation())

    const updateSettings = () => actions.updateSettings(Map({ acceptingContracts, usersettings } ))
    const resetSettings = () => actions.updateSettings(Map({ acceptingContracts, usersettings: defaultsettings } ))
    const toggleAcceptingContracts = () => actions.updateSettings(Map({ acceptingContracts: !acceptingContracts, usersettings }))

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

	const FileList = files.map((file, key) => (
		<div className="property pure-g" key={ key }>
			<div className="pure-u-2-3">
				<div className="name">{ file.get("path") }</div>
			</div>
			<div className="pure-u-1-3">
				<div className="value">
					<input type="number" data-setting={ key } className="value" value={ file.get("size") }></input>
				</div>
			</div>
		</div>
	)).toList()

	return (
		<div className="hosting">
			<div className="row">
				<div className="title">Configurations</div>
				<div className='controls'>
					<div className='button' id='announce' onClick={ announceHost }>
						<i className='fa fa-bullhorn'></i>
						&nbsp;Announce
					</div>
				</div>
			</div>

			<div className="row accept-contracts">
				<label>Accepting Contracts</label>
				<div className={ "toggle-switch" + (acceptingContracts ? "" : " off") } onClick={ toggleAcceptingContracts }>
					<div className="toggle-inner"></div>
				</div>
				<p>You must keep Sia-UI running while hosting.<br />Otherwise you will go offline and lose collateral.</p>
			</div>

			<div className="settings section">
				<div className="property row">
	  				<div className="title"></div>
					<div className="controls">
						<div className='button' onClick={ updateSettings }>
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

			<div className="files section">
				<div className="property row">
	  				<div className="title"></div>
					<div className="controls">
						<div className='button left' id='edit' onClick={ addStorageLocation }>
							<i className='fa fa-folder-open'></i>
							&nbsp;Add Storage Folder
						</div>
                        <div className='pure-u-1-3' style={{ "textAlign": "center" }}>
                            Max Size (GB)
						</div>

					</div>
				</div>
				{ FileList }
			</div>
		</div>
	)
}

export default Body

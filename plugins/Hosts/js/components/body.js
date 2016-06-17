import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'

const Body = ({ acceptingContracts, usersettings, actions }) => {
	const announceHost = () => null
	const resetHost = () => null
	const saveHost = () => null

	const handleTextInput = (e) => actions.updateSetting(e.target.attributes.getNamedItem("data-setting").value, e.target.value)
	const addStorageLocation = (e) => "" 

	const HostProperties = usersettings.map((setting, key) => (
		<div className="property pure-g" key={ key }>
			<div className="pure-u-2-3">
				<div className="name">{ setting.get("name") }</div>
			</div>
			<div className="pure-u-1-3">
				<div className="value">
					<input type="number" data-setting={ setting.get("name") } onChange={ handleTextInput } className="value" value={ setting.get("value") }></input>
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
				<div className={ "toggle-switch" + (acceptingContracts ? "" : " off") } onClick={ actions.toggleAcceptingContracts }>
					<div className="toggle-inner"></div>
				</div>
				<p>You must keep Sia-UI running while hosting.<br />Otherwise you will go offline and lose collateral.</p>
			</div>

			<div className="settings">
				<div className="property row">
	  				<div className="title"></div>
					<div className="controls">
						<div className='button' id='edit' onClick={ addStorageLocation }>
							<i className='fa fa-folder-open'></i>
							&nbsp;Add Storage Folder
						</div>
						<div className='button' id='edit' onClick={ saveHost }>
							<i className='fa fa-save'></i>
							&nbsp;Save
						</div>
						<div className='button' id='reset' onClick={ actions.resetHost }>
							<i className='fa fa-refresh'></i>
							&nbsp;Reset
						</div>
					</div>
				</div>
				{ HostProperties }
			</div>
		</div>
	)
}

export default Body

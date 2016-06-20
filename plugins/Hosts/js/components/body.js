import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import * as helper from '../utils/host.js'
import FilesList from '../containers/fileslist.js'
import SettingsList from '../containers/settingslist.js'

const Body = ({ acceptingContracts, usersettings, defaultsettings, files, actions }) => {
	const announceHost = () => null
	const toggleAcceptingContracts = () => actions.updateSettings(Map({ acceptingContracts: !acceptingContracts, usersettings }))

	return (
		<div className="hosting">
			<SettingsList />

			<div className="announce section">
				<div className="row property">
					<div className="title"></div>
					<div className='controls'>
						<div className='button' id='announce' onClick={ announceHost }>
							<i className='fa fa-bullhorn'></i>
							Click to Announce
						</div>
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

			<FilesList />
		</div>
	)
}

export default Body

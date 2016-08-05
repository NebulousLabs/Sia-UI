import React from 'react'
import FilesList from '../containers/fileslist.js'
import SettingsList from '../containers/settingslist.js'

const Body = ({ actions }) => {
	const announceHost = () => actions.announceHost()

	return (
		<div className="hosting">

			<div className="help section">
				<div className="property row">
					<div className="title">Help</div>
					<div className="controls">
						<div className="button" id="announce" onClick={announceHost}>
							<i className="fa fa-bullhorn" />
							Announce
						</div>
					</div>
				</div>
				<div className="property">
					<div className="instructions">
						To start hosting:
						<ol>
							<li>Add a storage folder.</li>
							<li>Set your prefered price, bandwidth cost, collateral, and duration.</li>
							<li>Set 'Accepting Contracts' to 'Yes'</li>
							<li>Announce your host by clicking the above 'Announce' button.</li>
						</ol>
					</div>
				</div>
			</div>

			<SettingsList />
			<FilesList />
		</div>
	)
}

export default Body

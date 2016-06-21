import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import * as helper from '../utils/host.js'
import FilesList from '../containers/fileslist.js'
import SettingsList from '../containers/settingslist.js'

const Body = ({ acceptingContracts, usersettings, defaultsettings, files, actions }) => {

	return (
		<div className="hosting">
			<SettingsList />
			<FilesList />
		</div>
	)
}

export default Body

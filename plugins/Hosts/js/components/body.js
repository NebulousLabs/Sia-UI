import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'

const Body = ({ usersettings, actions }) => {
	const announceHost = () => null
	const resetHost = () => null
	const saveHost = () => null

	const HostProperties = usersettings.map((setting, key) => (
		<div className="property pure-g" key={ key }>
			<div className="pure-u-2-3">
				<div className="name">{ setting.get("name") }</div>
			</div>
			<div className="pure-u-1-3">
				<div className="value">{ setting.get("value") }</div>
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
					<div className='button' id='reset' onClick={ resetHost }>
						<i className='fa fa-refresh'></i>
						&nbsp;Reset
					</div>
					<div className='button' id='save' onClick={ saveHost }>
						<i className='fa fa-save'></i>
						&nbsp;Save
					</div>
				</div>
			</div>


			<div className="row accept-contracts">
				<label>Accepting Contracts</label>
				<div className="toggle-switch">
					<div className="toggle-inner on"></div>
				</div>
			</div>

			<div id="properties">
				{ HostProperties }
			</div>
		</div>
	)
}

export default Body

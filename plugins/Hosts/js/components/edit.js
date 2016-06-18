import React, { PropTypes } from 'react'
import { Map } from 'immutable'

const EditModal = ({ usersettings, actions }) => {
	const saveHost = () => null

	const HostProperties = usersettings.map((setting, key) => (
		<p key={ key }>
			<label>{ setting.get("name") }</label>
			<input type="text"></input>
		</p>
	)).toList()

	return (
		<div className={ 'hosting-options-modal modal' + (true ? ' hidden'  : '') }>
			<form className="hosting-options modal-message">
				<div className="close-button">
					X
				</div>
				{ HostProperties }
				<p>
					<input className="button" type="button" value="Save"></input>
				</p>
			</form>
		</div>
	)
}

export default EditModal


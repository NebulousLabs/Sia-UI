import React, { PropTypes } from 'react'
import { Map } from 'immutable'

const DECLINED = 0
const ACCEPTED = 1

const WarningModalModal = ({ shouldShow, title, message, actions }) => {
	const acceptModal = () => actions.hideModal(ACCEPTED)
	const declineModal = () => actions.hideModal(DECLINED)

	return (
		<div className={ 'modal' + (shouldShow ? '': ' hidden') }>
			<div className='modal-message'>
				<div className='close-button' onClick={ declineModal }>X</div>
				<h3>{ title }</h3>
				<p>{ message }</p>
				<p>
					<input className='button accept' type='button' value='Accept' onClick={ acceptModal }></input>
					<br />
					<input className='button cancel' type='button' value='Cancel' onClick={ declineModal }></input>
				</p>
			</div>
		</div>
	)
}

export default WarningModalModal

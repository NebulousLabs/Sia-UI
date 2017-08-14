import PropTypes from 'prop-types'
import React from 'react'

const ReceivePrompt = ({addresses, address, description, actions}) => {
	const handleDismissClick = () => actions.hideReceivePrompt()
	const handleGenerateClick = () => {
		actions.getNewReceiveAddress()
		actions.setAddressDescription('')
	}
	const handleDescriptionChange = (e) => actions.setAddressDescription(e.target.value)
	const handleSaveClick = () => {
		actions.setAddressDescription('')
		actions.getNewReceiveAddress()
		actions.saveAddress({ description: description, address: address })
	}
	return (
		<div className="modal">
			<div className="receive-prompt">
				<div className="receive-form">
					<div className="receive-form-item">
						<p> Receiving Address </p>
						<input className="receive-address" value={address} readOnly />
					</div>
					<div className="receive-form-item">
						<p> Description </p>
						<input className="address-description" onChange={handleDescriptionChange} value={description} />
					</div>
				</div>
				<div className="receive-buttons">
					<button className="save-address-button" onClick={handleSaveClick}>Save</button>
					<button className="new-address-button" onClick={handleGenerateClick}>New</button>
				</div>
				<h3> Prior Addresses </h3>
				{ addresses.length > 0 ? (
					<table className="pure-table address-table">
						<tr>
							<th>Description</th>
							<th>Address</th>
						</tr>
						{ addresses.slice(0).reverse().map((oldAddress, key) => (
							<tr className="prior-address" key={key}>
								<td className="description">{oldAddress.description}</td>
								<td className="address">{oldAddress.address}</td>
							</tr>
						))}
					</table>
				) : ( <p> No prior addresses </p>)
				}
				<button className="done-button" onClick={handleDismissClick}>Done</button>
			</div>
		</div>
	)
}
ReceivePrompt.propTypes = {
	address: PropTypes.string,
	description: PropTypes.string,
	addresses: PropTypes.array,
}
export default ReceivePrompt

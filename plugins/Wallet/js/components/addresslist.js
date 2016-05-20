import React, { PropTypes } from 'react';
import { List } from 'immutable';

const AddressList = ({addresses}) => {
	const addressComponents = addresses.map((address) => (
		<div className="wallet-address">
			{address}
		</div>
	));
	return (
		<div className="address-list">
			{addresses}
		</div>
	);
}

AddressList.propTypes = {
	addresses: PropTypes.instanceOf(List),
};

export default AddressList;

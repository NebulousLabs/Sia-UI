import React, { PropTypes } from 'react';
import { List } from 'immutable';

const AddressList = ({addresses}) => {
	const addressComponents = addresses.map((address) => (
		<li className="wallet-address">
			{address}
		</li>
	));
	return (
		<ul className="address-list">
			{addresses}
		</ul>
	);
}

AddressList.propTypes = {
	addresses: PropTypes.instanceOf(List),
};

export default AddressList;

import React, { PropTypes } from 'react';
import { List } from 'immutable';

const AddressList = ({addresses}) => {
	const addressComponents = addresses.map((address, key) => (
		<li key={key} className="wallet-address">
			{address}
		</li>
	));
	return (
		<ul className="address-list">
			{addressComponents}
		</ul>
	);
}

AddressList.propTypes = {
	addresses: PropTypes.instanceOf(List),
};

export default AddressList;

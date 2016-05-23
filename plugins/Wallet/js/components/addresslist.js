import React, { PropTypes } from 'react';
import { List } from 'immutable';

const AddressList = ({addresses}) => {
	const addressComponents = addresses.map((address, key) => (
		<div key={key} className="wallet-address">
			{address}
		</div>
	));
	return (
		<div className="address-list">
			{addressComponents}
		</div>
	);
}

AddressList.propTypes = {
	addresses: PropTypes.instanceOf(List),
};

export default AddressList;

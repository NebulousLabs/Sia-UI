import React, { PropTypes } from 'react'
import { estimatedStoragePriceGBSC } from '../sagas/helpers.js'

const StoragePlan = ({storageSize, setStorageSize}) => {
	const onPlanClick = () => setStorageSize(storageSize)
	return (
		<div className="plan" onClick={onPlanClick}>
			<i className="fa fa-usd fa-2x"></i>
			<h3> {storageSize} GB </h3>
		</div>
	)
}

StoragePlan.propTypes = {
	storageSize: PropTypes.string.isRequired,
	setStorageSize: PropTypes.func.isRequired,
}

export default StoragePlan

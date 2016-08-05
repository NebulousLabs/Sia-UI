import React, { PropTypes } from 'react'

const StoragePlan = ({storageSize, currentStorageSize, setStorageSize}) => {
	const onPlanClick = () => setStorageSize(storageSize)
	return (
		<div className={storageSize === currentStorageSize ? 'plan selected' : 'plan'} onClick={onPlanClick}>
			<i className="fa fa-hdd-o fa-3x" />
			<p> {storageSize} GB </p>
		</div>
	)
}

StoragePlan.propTypes = {
	storageSize: PropTypes.string.isRequired,
	currentStorageSize: PropTypes.string.isRequired,
	setStorageSize: PropTypes.func.isRequired,
}

export default StoragePlan

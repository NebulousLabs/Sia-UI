import React, { PropTypes } from 'react'

const UsageStats = ({storageusage, storageavailable}) => (
	<div className="files-usage-info">
		<span> {storageusage} Used / {storageavailable} Available </span>
	</div>
)

UsageStats.propTypes = {
	storageusage: PropTypes.string.isRequired,
	storageavailable: PropTypes.string.isRequired,
}

export default UsageStats

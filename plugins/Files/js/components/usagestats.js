import PropTypes from 'prop-types'
import React from 'react'

const UsageStats = ({allowance, spending}) => (
	<div className="files-usage-info">
		<span> {spending} SC Spent / {allowance} SC Allocated </span>
	</div>
)

UsageStats.propTypes = {
	allowance: PropTypes.string.isRequired,
	spending: PropTypes.string.isRequired,
}

export default UsageStats

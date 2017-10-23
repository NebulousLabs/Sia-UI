import PropTypes from 'prop-types'
import React from 'react'

// UsageStats defines the presentation component for displaying file spending.
const UsageStats = ({allowance, downloadspending, uploadspending, storagespending, contractspending, unspent, renewheight}) => {
	if (allowance === 0) {
		return null
	}
	const totalSpending = downloadspending+uploadspending+storagespending+contractspending
	return (
		<div className="files-usage-info">
			<div className="spending-container">
				<div style={{width: Math.min(100, (totalSpending/allowance)*100) + '%'}} className="spending-bar">
					<div style={{width: (contractspending/totalSpending)*100+ '%'}} className="contract-spending" />
					<div style={{width: (storagespending/totalSpending)*100+ '%'}} className="storage-spending" />
					<div style={{width: (downloadspending/totalSpending)*100+ '%'}} className="download-spending" />
					<div style={{width: (uploadspending/totalSpending)*100 + '%'}} className="upload-spending" />
				</div>
			</div>
			<p className="remaining-text">{unspent} SC remaining</p>
			<div className="spending-breakdown">
				<ul>
					<li className="allowance-spending-breakdown">Allowance: {allowance} SC </li>
					<li className="renew-info">Renews at Block Height: {renewheight}</li>
					<li className="contract-spending-breakdown"> Contract Spending: {contractspending} SC </li>
					<li className="storage-spending-breakdown"> Storage Spending: {storagespending} SC </li>
					<li className="upload-spending-breakdown"> Upload Spending: {uploadspending} SC </li>
					<li className="download-spending-breakdown"> Download Spending: {downloadspending} SC </li>
				</ul>
			</div>
		</div>
	)
}

UsageStats.propTypes = {
	allowance: PropTypes.number.isRequired,
	downloadspending: PropTypes.number.isRequired,
	uploadspending: PropTypes.number.isRequired,
	storagespending: PropTypes.number.isRequired,
	contractspending: PropTypes.number.isRequired,
	unspent: PropTypes.number.isRequired,
	renewheight: PropTypes.number.isRequired,
}

export default UsageStats


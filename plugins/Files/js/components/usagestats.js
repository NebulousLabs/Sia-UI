import PropTypes from 'prop-types'
import React from 'react'

// UsageStats defines the presentation component for displaying file spending.
const UsageStats = ({allowance, downloadspending, uploadspending, storagespending, contractspending}) => {
	const unspent = () => allowance - (downloadspending+uploadspending+storagespending+contractspending)
	return (
		<div className="files-usage-info">
			<div className="spending-bar">
				<div style={{width: (contractspending/allowance)*100+ '%'}} className="contract-spending" />
				<div style={{width: (storagespending/allowance)*100+ '%'}} className="storage-spending" />
				<div style={{width: (downloadspending/allowance)*100+ '%'}} className="download-spending" />
				<div style={{width: (uploadspending/allowance)*100 + '%'}} className="upload-spending" />
			</div>
			<p className="remaining-text">{unspent()} SC remaining</p>
			<div className="spending-breakdown">
				<ul>
					<li className="allowance-spending-breakdown"> Allowance: {allowance} SC </li>
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
}

export default UsageStats


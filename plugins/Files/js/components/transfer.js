import PropTypes from 'prop-types'
import React from 'react'
import ProgressBar from './progressbar.js'

const Transfer = ({name, progress, status, onClick}) => (
	<li className="filetransfer" onClick={onClick}>
		<div className="transfer-info">
			<div className="transfername">{name}</div>
			<ProgressBar progress={progress} />
			<span className="transfer-status">{status}</span>
		</div>
	</li>
)

Transfer.propTypes = {
	name: PropTypes.string.isRequired,
	progress: PropTypes.number.isRequired,
	status: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
}

export default Transfer

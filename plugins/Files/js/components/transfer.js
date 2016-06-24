import React, { PropTypes } from 'react'
import ProgressBar from './progressbar.js'

const Transfer = ({name, progress, onClick}) => (
	<li className="filetransfer" onClick={onClick}>
		<div className="transfer-info">
			<div className="transfername">{name}</div>
			<ProgressBar progress={progress} />
		</div>
	</li>
)

Transfer.propTypes = {
	name: PropTypes.string.isRequired,
	progress: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
}

export default Transfer

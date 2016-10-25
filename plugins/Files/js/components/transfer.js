import React, { PropTypes } from 'react'
import ProgressBar from './progressbar.js'

const Transfer = ({name, progress, onClick}) => (
	<li className="filetransfer" onClick={onClick}>
		<div className="transfer-info">
			<div className="transfername">{name}</div>
			{
				progress === 100 ? (
					<span className="transfer-status">Completed</span>
				) : (
					<ProgressBar progress={progress} />
				)
			}
		</div>
	</li>
)

Transfer.propTypes = {
	name: PropTypes.string.isRequired,
	progress: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired,
}

export default Transfer

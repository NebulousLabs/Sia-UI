import React, { PropTypes } from 'react'
import ProgressBar from './progressbar.js'

const RedundancyInfo = ({filename, uploadprogress, redundancy}) => (
	<div className="redundancy-info">
		<h3> {filename} </h3>
		<div className="upload-progress">
			<span> Upload Progress: </span>
			<ProgressBar progress={uploadprogress} />
		</div>
		<div className="redundancy">
			Redundancy: {redundancy}
		</div>
	</div>
)

RedundancyInfo.propTypes = {
	filename: PropTypes.string.isRequired,
	uploadprogress: PropTypes.number.isRequired,
	redundancy: PropTypes.number.isRequired,
}

export default RedundancyInfo


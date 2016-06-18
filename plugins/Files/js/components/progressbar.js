import React, { PropTypes } from 'react'

const ProgressBar = ({progress}) => {
	const style = {
		width: progress.toString() + '%',
		height: '100%',
		transition: 'width 200ms',
	}
	return (
		<div className="progress-container">
			<div className="progress-bar" style={style}></div>
		</div>
	)
}

ProgressBar.propTypes = {
	progress: PropTypes.number.isRequired,
}

export default ProgressBar

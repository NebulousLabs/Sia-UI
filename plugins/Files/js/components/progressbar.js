import PropTypes from 'prop-types'
import React from 'react'

const ProgressBar = ({progress}) => {
	const style = {
		width: progress.toString() + '%',
		height: '100%',
		transition: 'width 200ms',
		backgroundColor: '#00CBA0',
	}
	return (
		<div className="progress-container">
			<div className="progress-bar" style={style} />
		</div>
	)
}

ProgressBar.propTypes = {
	progress: PropTypes.number.isRequired,
}

export default ProgressBar

import PropTypes from 'prop-types'
import React from 'react'

const ProgressBar = ({progress}) => {
	const style = {
		width: progress.toString() + '%',
		height: '100%',
		transition: 'width 200ms',
		backgroundColor: 'var(--main-color)',
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

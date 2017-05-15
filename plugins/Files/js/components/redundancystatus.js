import PropTypes from 'prop-types'
import React from 'react'

const colorNotAvailable = '#FF8080'
const colorGoodRedundancy = '#00CBA0'

const RedundancyStatus = ({available, redundancy, uploadprogress}) => {
	const indicatorStyle = {
		opacity: (() => {
			if (!available || redundancy < 1.0) {
				return 1
			}
			if (uploadprogress > 100) {
				return 1
			}
			return uploadprogress/100
		})(),
		color: (() => {
			if (!available || redundancy < 1.0) {
				return colorNotAvailable
			}
			return colorGoodRedundancy
		})(),
	}
	return (
		<div className="redundancy-status">
			<i className="fa fa-cubes" style={indicatorStyle} />
			<span className="redundancy-text">{redundancy > 0 ? redundancy + 'x' : '--'}</span>
		</div>
	)
}

RedundancyStatus.propTypes = {
	available: PropTypes.bool.isRequired,
	redundancy: PropTypes.number.isRequired,
	uploadprogress: PropTypes.number.isRequired,
}

export default RedundancyStatus


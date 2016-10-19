import React, { PropTypes } from 'react'

const colorNotAvailable = '#FF8080'
const colorLowRedundancy = '#FFFC9E'
const colorGoodRedundancy = '#00CBA0'

const RedundancyStatus = ({available, redundancy, showRedundancyInfo, onRedundancyClick}) => {
	const indicatorStyle = {
		color: (() => {
			if (!available || redundancy < 1.0) {
				return colorNotAvailable
			}
			if (redundancy < 2.5) {
				return colorLowRedundancy
			}
			return colorGoodRedundancy
		})()
	}
	const infoStyle = {
		display: {showRedundancyInfo ? "hidden" : "inline-block"},
	}
	return (
		<div className="redundancy-status">
			<i className="fa fa-tachometer" onClick={onRedundancyClick} style={indicatorStyle} />
			<div className="redundancy-info">
			</div>
		</div>
	)
}

RedundancyStatus.propTypes = {
	available: PropTypes.bool.isRequired,
	redundancy: PropTypes.number.isRequired,
	onRedundancyClick: PropTypes.func.isRequired,
}

export default RedundancyStatus


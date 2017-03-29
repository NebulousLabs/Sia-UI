import React, { PropTypes } from 'react'

const HostStatus = ({connectable, working}) => {
	if (!connectable) {
		return (
			<div className="host-status">
				<i className="fa fa-times offline-icon" />
				<span> Host Unreachable </span>
			</div>
		)
	}

	if (connectable && !working) {
		return (
			<div className="host-status">
				<i className="fa fa-times offline-icon" />
				<span> Host Not Working </span>
			</div>
		)
	}

	return (
		<div className="host-status">
			<i className="fa fa-check online-icon" />
			<span> Host Online </span>
		</div>
	)
}

HostStatus.propTypes = {
	connectable: PropTypes.bool.isRequired,
	working: PropTypes.bool.isRequired,
}

export default HostStatus


import React, { PropTypes } from 'react'

const HostStatus = ({online}) => {
	if (online) {
		return (
			<div className="host-status">
				<i className="fa fa-check online-icon" />
				<span> Host Connectable </span>
			</div>
		)
	}

	return (
		<div className="host-status">
			<i className="fa fa-times offline-icon" />
			<span> Host Not Connectable </span>
		</div>
	)
}

HostStatus.propTypes = {
	online: PropTypes.bool.isRequired,
}

export default HostStatus


import React, { PropTypes } from 'react'

const HostStatus = ({online}) => (
	<div className="host-status">
		<span> Host Status: </span>
		{ online ? (
			<i className="fa fa-check fa-2x online-icon" />
		) : (
			<i className="fa fa-times fa-2x offline-icon" />
		)}
	</div>
)

HostStatus.propTypes = {
	online: PropTypes.bool.isRequired,
}

export default HostStatus


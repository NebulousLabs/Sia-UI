import PropTypes from 'prop-types'
import React from 'react'

const HostStatus = ({connectabilitystatus, workingstatus}) => {
	if (connectabilitystatus === 'checking' && workingstatus === 'checking') {
		return (
			<div className="host-status">
				<i className="fa fa-refresh fa-spin inactive-icon" />
				<span> Checking Host Status... </span>
				<div className="host-status-info">
					Sia-UI is determining the status of your Host.
				</div>
			</div>
		)
	}

	if (connectabilitystatus === 'not connectable' && workingstatus === 'not working') {
		return (
			<div className="host-status">
				<i className="fa fa-times offline-icon" />
				<span> Host Unreachable </span>
				<div className="host-status-info">
					Your host is not connectable at the configured net address. Check your UPNP or NAT settings.
				</div>
			</div>
		)
	}

	if (connectabilitystatus === 'connectable' && workingstatus === 'not working') {
		return (
			<div className="host-status">
				<i className="fa fa-times inactive-icon" />
				<span> Host Inactive </span>
				<div className="host-status-info">
					Your host is connectable, but it is not being used by any renters.
				</div>
			</div>
		)
	}

	return (
		<div className="host-status">
			<i className="fa fa-check online-icon" />
			<span> Host Online </span>
			<div className="host-status-info">
				Your host is connectable and is being contacted by renters.
			</div>
		</div>
	)
}

HostStatus.propTypes = {
	connectabilitystatus: PropTypes.string.isRequired,
	workingstatus: PropTypes.string.isRequired,
}

export default HostStatus


import PropTypes from 'prop-types'
import React from 'react'

const ContractorStatus = ({settingAllowance, contractCount}) => (
	<div className="contractor-status">
		{ settingAllowance ? (
			<div>
				<i className="fa fa-circle-o-notch fa-spin fa-2x fa-fw" />
				<span>Forming Contracts...</span>
			</div>
			) : ( <span> {contractCount} contracts </span> )
		}
	</div>
)

ContractorStatus.propTypes = {
	settingAllowance: PropTypes.bool.isRequired,
	contractCount: PropTypes.number.isRequired,
}

export default ContractorStatus


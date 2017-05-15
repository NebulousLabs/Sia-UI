import PropTypes from 'prop-types'
import React from 'react'

const UnlockWarning = ({onClick}) => (
	<div className="allowance-dialog unlock-warning">
		<h1 className="unlock-warning-head"> Your wallet must be unlocked and synchronized to buy storage. </h1>
		<div className="allowance-buttons">
			<button onClick={onClick} className="allowance-button-accept">OK</button>
		</div>
	</div>
)

UnlockWarning.propTypes = {
	onClick: PropTypes.func.isRequired,
}

export default UnlockWarning

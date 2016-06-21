import React from 'react'

const SetAllowanceButton = ({actions}) => {
	const handleClick = () => actions.showAllowanceDialog()
	return (
		<div onClick={handleClick} className="set-allowance-button">
			<i className="fa fa-credit-card fa-2x"></i>
			<span>Buy Storage</span>
		</div>
	)
}

export default SetAllowanceButton

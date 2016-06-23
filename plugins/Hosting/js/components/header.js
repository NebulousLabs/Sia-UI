import React from 'react'

const Header = ({ numContracts, earned, expected }) => (
	<header className="header">
		<div className="title">Hosting</div>
		<div className="capsule">
			<div className="pod" id="contacts">{numContracts} active contracts</div>
			<div className="pod" id="money">{earned} SC earned</div>
			<div className="pod" id="expected">{expected} SC expected</div>
		</div>
	</header>
)

export default Header

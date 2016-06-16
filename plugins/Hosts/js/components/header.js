import React, { PropTypes } from 'react'

const Header = ({ numContracts, storage }) => (
	<header className="header">
		<div className='title'>Hosting</div>
		<div className='capsule'>
			<div className='pod' id='numcontracts'>{ numContracts } contacts</div>
			<div className='pod' id='storage'>{ storage } GB used</div>
			<div className='pod' id='money'>{ 0 } SC earned</div>
			<div className='pod' id='money'>{ 0 } SC expected</div>
		</div>
	</header>
)

export default Header

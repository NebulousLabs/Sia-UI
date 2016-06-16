import React, { PropTypes } from 'react'

//<div className='pod' id='numcontracts'>{ numContracts } contacts</div>
const Header = ({ numContracts, earned, expected, storage }) => (
	<header className="header">
		<div className='title'>Hosting</div>
		<div className='capsule'>
			<div className='pod' id='storage'>{ storage } GB used</div>
			<div className='pod' id='money'>{ earned } SC earned</div>
			<div className='pod' id='expected'>{ expected } SC expected</div>
		</div>
	</header>
)

export default Header

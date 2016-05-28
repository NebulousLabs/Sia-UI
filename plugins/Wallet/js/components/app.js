import React from 'react'
import LockScreen from '../containers/lockscreen.js'
import Wallet from '../containers/wallet.js'

const WalletApp = () => (
	<div className="app">
		<LockScreen />
		<Wallet />
	</div>
)

export default WalletApp

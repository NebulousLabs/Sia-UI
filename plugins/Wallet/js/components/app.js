import React from 'react'
import LockScreen from '../containers/lockscreen.js'
import Wallet from '../containers/wallet.js'
import { hot } from 'react-hot-loader'

const WalletApp = () => (
  <div className='app'>
    <LockScreen />
    <Wallet />
  </div>
)

export default hot(module)(WalletApp)

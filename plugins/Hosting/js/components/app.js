import React from 'react'
import Header from '../containers/header.js'
import Body from '../containers/body.js'
import ResizeDialog from '../containers/resizeDialog.js'
import AnnounceDialog from '../containers/announce.js'
import WalletModal from '../containers/walletmodal.js'
import { hot } from 'react-hot-loader'

const HostingApp = () => (
  <div className='app'>
    <Header />
    <Body />
    <ResizeDialog />
    <AnnounceDialog />
    <WalletModal />
  </div>
)

export default hot(module)(HostingApp)

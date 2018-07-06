import React from 'react'
import CommandLine from '../containers/commandline.js'
import { hot } from 'react-hot-loader'

const CommandLineApp = () => (
  <div className='app'>
    <CommandLine />
  </div>
)

export default hot(module)(CommandLineApp)

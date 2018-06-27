import React from 'react'
import FilterControls from '../containers/filtercontrols.js'
import LogView from '../containers/logview.js'
import { hot } from 'react-hot-loader'

const App = () => (
  <div>
    <FilterControls />
    <LogView />
  </div>
)

export default hot(module)(App)

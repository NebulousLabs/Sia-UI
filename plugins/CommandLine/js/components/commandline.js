import React, { PropTypes } from 'react'
import CommandHistoryList from '../containers/commandhistorylist.js'
import CommandInput from '../containers/commandinput.js'

const CommandLine = () => (
	<div className="command-history">
        <CommandHistoryList />

        <footer className="commandFooter">
			<CommandInput />
        </footer>
	</div>
)

export default CommandLine

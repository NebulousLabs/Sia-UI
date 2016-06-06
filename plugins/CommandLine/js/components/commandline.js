import React, { PropTypes } from 'react'
import CommandHistoryList from '../containers/commandhistorylist.js'
import CommandInput from '../containers/commandinput.js'

//import SendButton from '../containers/sendbutton.js'

const CommandLine = ({ commandHistory }) => (
	<div className="command-history">
        <CommandHistoryList />

        <footer className="commandFooter">
			<CommandInput />
        </footer>
	</div>
)

CommandLine.propTypes = {
	commandHistory: PropTypes.array
}

export default CommandLine

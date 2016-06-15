import React from 'react'
import { Map } from 'immutable'
import { spawnCommand, isCommandSpecial, commandInputHelper } from '../utils/helpers.js'

const CommandInput = ({currentCommand, showCommandOverview, commandHistory, commandRunning, actions}) => {
	const handleTextInput = (e) => actions.setCurrentCommand(e.target.value)
	const handleKeyboardPress = (e) => commandInputHelper(e, actions, currentCommand, showCommandOverview, commandHistory.size)
	return (
		<input id="command-input" onChange={handleTextInput} onKeyDown={handleKeyboardPress} type="text" value={currentCommand} disabled={ commandRunning }></input>
	)
}

export default CommandInput

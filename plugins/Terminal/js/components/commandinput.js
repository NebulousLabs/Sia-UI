import React from 'react'
import { Map } from 'immutable'
import { spawnCommand, isCommandSpecial } from '../utils/helpers.js'
//These commands need a password prompt.
const specialCommands = [ ['wallet', 'unlock'], ['wallet', 'load', 'seed'], ['help'], ['?'] ]

const CommandInput = ({currentCommand, showCommandOverview, actions}) => {
	componentDidUpdate: {
		setTimeout(() => document.getElementById('command-input').focus(), 0)
	}

	reduce: {
		const handleTextInput = (e) => {
			actions.setCurrentCommand(e.target.value)
		}

		const handleKeyboardPress = (e) => {
			let eventTarget = e.target
			//Enter button.
			if (e.keyCode === 13) {

				//Check if command is special.
				switch (  isCommandSpecial(currentCommand, specialCommands) ) {
				case -1: //Regular command.
					spawnCommand(currentCommand, actions) //Spawn command defined in index.js.
					break

				case 0: //wallet unlock
				case 1: //wallet load seed
					actions.showWalletPrompt()
					break

				case 2: //help
					let text = 'help'
				case 3: //?
					let newText = text || '?'
					if (showCommandOverview) {
						actions.hideCommandOverview()
					} else {
						actions.showCommandOverview()
					}

					//The command history won't actually show a help command so it is fine to add the command.
					let newCommand = Map({ command: newText, result: '', id: Math.floor(Math.random()*1000000) })
					actions.addCommand(newCommand)
					break

				default:
					console.log(`Command input error: ${currentCommand}`)
					break
				}
			 } else if (e.keyCode === 38) {
				//Up arrow.
				actions.loadPrevCommand(eventTarget.value)
				setTimeout( () => {
					eventTarget.setSelectionRange(eventTarget.value.length, eventTarget.value.length)
				}, 0)
			} else if (e.keyCode === 40) {
				//Down arrow.
				actions.loadNextCommand(eventTarget.value)
				setTimeout(() => {
					eventTarget.setSelectionRange(eventTarget.value.length, eventTarget.value.length)
				}, 0)
			}
		}

		return (
			<input id="command-input" onChange={handleTextInput} onKeyDown={handleKeyboardPress} type="text" value={currentCommand} autoComplete="on" autoFocus="true"></input>
		)
	}
}

export default CommandInput

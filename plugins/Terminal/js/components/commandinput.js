
import React from 'react'
import { commandInputHelper } from '../utils/helpers.js'

export default class CommandInput extends React.Component {
	componentDidUpdate() {
		//Give DOM time to register the update.
		if (!this.props.showWalletPrompt && !this.props.showSeedPrompt) {
			this._input.focus()
		}
	}

	render() {
		const handleTextInput = (e) => this.props.actions.setCurrentCommand(e.target.value)
		const handleKeyboardPress = (e) => commandInputHelper(e, this.props.actions, this.props.currentCommand,
			this.props.showCommandOverview, this.props.commandHistory.size)
		return (
			<input id="command-input" onChange={handleTextInput} onKeyDown={handleKeyboardPress} type="text"
				value={this.props.currentCommand} autoFocus autoComplete
				ref={(c) => this._input = c}
			/>
		)
	}
}

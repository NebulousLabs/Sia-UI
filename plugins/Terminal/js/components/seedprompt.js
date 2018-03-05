import React from 'react'
import { httpCommand } from '../utils/helpers.js'
import querystring from 'querystring'

export default class WalletSeedPrompt extends React.Component {
	componentDidUpdate() {
		//Give DOM time to register the update.
		if (this.props.showSeedPrompt) {
			this._seedPasswd.focus()
		}
	}

	render() {
		const handleKeyboardPress = (e) => {
			if (e.keyCode === 13) {
				//Grab input, spawn process, and pipe text field to stdin.
				const siac = httpCommand(this.props.currentCommand, this.props.actions, this.props.commandHistory.size)

				siac.write(querystring.stringify({
					'encryptionpassword': this.props.walletPassword,
					'seed': e.target.value,
					'dictionary': 'english',
				}))
				siac.end()
				e.target.value = ''
				this.props.actions.setWalletPassword('')
				this.props.actions.hideSeedPrompt()
			}
		}

		return (
			<div id="seed-prompt" className={'modal ' + (this.props.showSeedPrompt ? '' : 'hidden')}>
				<div className="modal-message">
					<h3>New seed</h3>
					<p>Please type your new seed and press enter to continue.</p>
					<input onKeyDown={handleKeyboardPress} type="password" id="seed-passwd" ref={(c) => this._seedPasswd = c} />
				</div>
			</div>
		)
	}
}

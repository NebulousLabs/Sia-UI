import React from 'react'
import querystring from 'querystring'
import { httpCommand, commandType, getArgumentString } from '../utils/helpers.js'
import * as constants from '../constants/helper.js'

//This command needs a second prompt.
export default class WalletPasswordPrompt extends React.Component {
	componentDidUpdate() {
		//Give DOM time to register the update.
		if (this.props.showWalletPrompt) {
			this._walletPasswd.focus()
		}
	}

	render() {
		const handleTextInput = (e) => this.props.actions.setWalletPassword(e.target.value)
		const handleKeyboardPress = (e) => {
			if (e.keyCode === 13) {
				switch ( commandType(this.props.currentCommand, constants.specialCommands) ) {
				case constants.WALLET_SEED:
					this.props.actions.showSeedPrompt()
					break

				case constants.WALLET_033X:
					let options = {
						'source': getArgumentString(this.props.currentCommand, constants.specialCommands[constants.WALLET_033X]),
						'encryptionpassword': this.props.walletPassword,
					}
				case constants.WALLET_SIAG:
					options = options || {
						'keyfiles': getArgumentString(this.props.currentCommand, constants.specialCommands[constants.WALLET_SIAG]),
						'encryptionpassword': this.props.walletPassword,
					}

					//Grab input, spawn process, and pipe text field to stdin.
					let siac = httpCommand(this.props.currentCommand, this.props.actions, this.props.commandHistory.size)
					siac.write(querystring.stringify(options))
					siac.end()
					this.props.actions.setWalletPassword('')
					break

				default:
					//Grab input, spawn process, and pipe text field to stdin.
					siac = httpCommand(this.props.currentCommand, this.props.actions, this.props.commandHistory.size)
					siac.write(querystring.stringify({ 'encryptionpassword': this.props.walletPassword }))
					siac.end()
					this.props.actions.setWalletPassword('')
					break
				}
				this.props.actions.hideWalletPrompt()
			}
		}

		return (
			<div id="wallet-prompt" className={'modal ' + (this.props.showWalletPrompt ? '' : 'hidden')}>
				<div className="modal-message">
					<h3>Wallet Password</h3>
					<p>Please type your wallet password and press enter to continue.</p>
					<input onChange={handleTextInput} onKeyDown={handleKeyboardPress} type="password"
						id="wallet-passwd" ref={(c) => this._walletPasswd = c} value={this.props.walletPassword}
					/>
				</div>
			</div>
		)
	}
}

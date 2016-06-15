import React from 'react'
import querystring from 'querystring'
import { httpCommand, commandType } from '../utils/helpers.js'
import * as constants from '../constants/helper.js'

//This command needs a second prompt.
const moreSpecialCommands = [ ['wallet', 'load', 'seed'] ]

const WalletPasswordPrompt = ({ showWalletPrompt, currentCommand, commandHistory, actions }) => {
	const handleKeyboardPress = (e) => {
		if (e.keyCode === 13) {
			switch ( commandType(currentCommand, moreSpecialCommands) ) {
			case constants.WALLET_SEED:
				actions.showSeedPrompt()
				break

			default:
				//Grab input, spawn process, and pipe text field to stdin.
				console.log('SPECIAL COMMAND: ' + currentCommand)
				let siac = httpCommand(currentCommand, actions, commandHistory.size)
				siac.write(querystring.stringify({ 'encryptionpassword': e.target.value }))
				siac.end()
				break
			}
			actions.hideWalletPrompt()
		}
	}

	return (
		<div id="wallet-prompt" className={'modal ' + (showWalletPrompt ? '' : 'hidden')}>
			<div className="modal-message">
				<h3>Wallet Password</h3>
				<p>Please type your wallet password and press enter to continue.</p>
				<input onKeyDown={handleKeyboardPress} type="password" id="wallet-passwd"></input>
			</div>
		</div>
	)
}

export default WalletPasswordPrompt

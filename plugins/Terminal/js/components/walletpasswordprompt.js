import React from 'react'
const querystring = require('querystring')

//This command needs a second prompt.
const moreSpecialCommands= [ ['wallet', 'load', 'seed'] ]

const WalletPasswordPrompt = ({ showWalletPrompt, currentCommand, actions }) => {
	componentDidUpdate: {
		//Give DOM time to register the update.
		if (showWalletPrompt) {
			setTimeout(() => {
				var walletpasswd = document.getElementById('wallet-passwd')
				walletpasswd.focus()
				walletpasswd.setSelectionRange(0, walletpasswd.value.length)
			}, 1)
		}
	}

	render: {
		const handleKeyboardPress = (e) => {
			if (e.keyCode === 13) {
				switch ( isCommandSpecial(currentCommand, moreSpecialCommands) ) {
				case 0:
					actions.showSeedPrompt()
					break

				default:
						//Grab input, spawn process, and pipe text field to stdin.
					console.log('SPECIAL COMMAND: ' + currentCommand)
					var siac = httpCommand(currentCommand, actions)
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
}

export default WalletPasswordPrompt

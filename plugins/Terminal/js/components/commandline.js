import React from 'react'
import CommandHistoryList from '../containers/commandhistorylist.js'
import CommandInput from '../containers/commandinput.js'
import WalletPasswordPrompt from '../containers/walletpasswordprompt.js'
import WalletSeedPrompt from '../containers/seedprompt.js'

const CommandLine = ({showCommandOverview, actions}) => {

	const toggleCommandOverview = () => {
		if (showCommandOverview) {
			actions.hideCommandOverview()
		} else {
			actions.showCommandOverview()
		}
	}

	return (
		<div className={'command-history ' + (showCommandOverview ? 'overview' : '')}>
			<CommandHistoryList />
			<footer className="commandFooter">
				 <div className={'command-overview ' + (showCommandOverview ? 'expanded' : '')} >
					<div className="help-button" onClick={toggleCommandOverview}>?</div>
					<div className="command-overview-inner">
						<h3>Available Commands:</h3>
						<p>
							consensus   Print the current state of consensus<br />
							gateway     Perform gateway actions<br />
							host        Perform host actions<br />
							hostdb      View or modify the host database<br />
							miner       Perform miner actions<br />
							renter      Perform renter actions<br />
							stop        Stop the Sia daemon<br />
							update      Update Sia<br />
							version     Print version information<br />
							wallet      Perform wallet actions<br /><br />

							Use '[command] --help' for more information about a command.<br />
						</p>
					</div>
				</div>
				<CommandInput />
			</footer>
			<WalletPasswordPrompt />
			<WalletSeedPrompt />
		</div>
	)
}

export default CommandLine

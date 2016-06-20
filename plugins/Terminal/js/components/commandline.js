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
							version     Print version information<br />
							stop        Stop the Sia daemon<br />
							host        Perform host actions<br />
							hostdb      View or modify the host database<br />
							miner       Perform miner actions<br />
							wallet      Perform wallet actions<br />
							renter      Perform renter actions<br />
							gateway     Perform gateway actions<br />
							consensus   Print the current state of consensus<br /><br />
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

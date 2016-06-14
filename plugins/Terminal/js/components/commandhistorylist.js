import React, { PropTypes } from 'react'
import { List } from 'immutable'

const CommandHistoryList = ({commandHistory}) => {

	componentDidUpdate: {
		let ch = document.getElementsByClassName('command-history-list')[0]
		if (ch) {
			//Give the DOM time to process the DOM changes.
			setTimeout( () => ch.scrollTop = ch.scrollHeight, 0)
		}
	}

	render: {
		console.log('Re-rendering.')
		const CommandHistoryComponents = commandHistory.filterNot(
			(command) => command.get('command') === 'help' || command.get('command') === '?'
		).map((command, key) => (
			<li key={key}>
				<h3>{command.get('command')}
					<i className={'fa fa-cog fa-spin ' + ( command.get('stat') === 'running' ? '' : 'hide')}></i>
				</h3>
				<p>{command.get('result')}</p>
			</li>
	   	))

		return (
			<div className="command-history-list">
				<ul>
					{CommandHistoryComponents}
				</ul>
			</div>
		)
	}
}

CommandHistoryList.propTypes = {
	commandHistory: PropTypes.instanceOf(List),
}

export default CommandHistoryList

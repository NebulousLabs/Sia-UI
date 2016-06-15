import React, { PropTypes } from 'react'
import { List } from 'immutable'

const CommandHistoryList = React.createClass({
	propTypes: {
		commandHistory: PropTypes.instanceOf(List),
	},

	componentDidUpdate: function() {
		this._commandHistoryList.scrollTop = this._commandHistoryList.scrollHeight
	},

	render: function() {
		console.log('Re-rendering.')
		const CommandHistoryComponents = this.props.commandHistory.filterNot(
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
			<div className="command-history-list" ref={(c) => this._commandHistoryList = c}>
				<ul>
					{CommandHistoryComponents}
				</ul>
			</div>
		)
	},
})

export default CommandHistoryList

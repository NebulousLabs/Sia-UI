import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'immutable'

export default class CommandHistoryList extends React.Component {
	componentDidUpdate() {
		this._commandHistoryList.scrollTop = this._commandHistoryList.scrollHeight
	}

	render() {
		const CommandHistoryComponents = this.props.commandHistory.filterNot(
			(command) => command.get('command') === 'help' || command.get('command') === '?'
		).map((command, key) => (
			<li key={key}>
				<h3>{command.get('command')}
					<i className={'fa fa-cog fa-spin ' + ( command.get('stat') === 'running' ? '' : 'hide')} />
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
	}
}

CommandHistoryList.propTypes = { commandHistory: PropTypes.instanceOf(List) }

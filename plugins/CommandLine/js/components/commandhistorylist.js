import React, { PropTypes } from 'react'
import { List, Map } from 'immutable'

const CommandHistoryList = ({commandHistory}) => {

    componentDidUpdate: {
        var ch = document.getElementsByClassName("command-history")[0]
        if (ch)
            //Give the DOM time to process the DOM changes.
            setTimeout( function(){ ch.scrollTop = ch.scrollHeight; }, 0)
    }

    render: {
       	const CommandHistoryComponents = commandHistory.map((command, key) => {
    		return (
    			<tr key={key}>
    				<td>{command.command}</td>
    				<td>{command.result}</td>
    			</tr>
    		)
    	})
    	return (
    		<div className="command-history-list">
    			<h2> Commands </h2>
    			<table className="pure-table">
    				<thead>
    					<tr>
    						<th>Command</th>
    						<th>Result</th>
    					</tr>
    				</thead>
    				<tbody>
    					{CommandHistoryComponents}
    				</tbody>
    			</table>
    		</div>
    	)
    }
}

CommandHistoryList.propTypes = {
	commandHistory: PropTypes.instanceOf(List),
}

export default CommandHistoryList

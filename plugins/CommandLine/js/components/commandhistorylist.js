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
        console.log('Re-rendering.')
       	const CommandHistoryComponents = commandHistory.map((command, key) => {
    		return (
    			<li key={key}>
    				<h3>{command.get('command')}</h3>
    				<p>{command.get('result')}</p>
    			</li>
    		)
    	})

    	return (
    		<div className="command-history-list">
    			<h2> Commands </h2>
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

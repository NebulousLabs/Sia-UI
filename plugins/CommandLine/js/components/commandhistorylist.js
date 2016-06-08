import React, { PropTypes } from 'react'
import { List, Map } from 'immutable'

const CommandHistoryList = ({commandHistory}) => {

    componentDidUpdate: {
        var ch = document.getElementsByClassName("command-history-list")[0]
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
                <div className = "command-overview">
                    <h3>Available Commands:</h3>
                    <p className="command-overview">
                        version     Print version information<br />
                        stop        Stop the Sia daemon<br />
                        host        Perform host actions<br />
                        hostdb      View or modify the host database<br />
                        miner       Perform miner actions<br />
                        wallet      Perform wallet actions<br />
                        renter      Perform renter actions<br />
                        gateway     Perform gateway actions<br />
                        consensus   Print the current state of consensus<br />
                    </p>
                </div>
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

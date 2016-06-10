import React from 'react'
import { Map } from 'immutable'

//These commands need a password prompt.
const specialCommands = [ ['wallet', 'unlock'], ['wallet', 'load', 'seed'], ['help'] ]

const CommandInput = ({commandHistory, currentCommand, showCommandOverview, actions}) => {

    componentDidUpdate: {
        setTimeout(function (){
            var commandinput = document.getElementById('command-input')
            commandinput.focus()
        }, 0)
    }

    reduce: {
        const handleTextInput = (e) => {
            actions.setCurrentCommand(e.target.value)
        }
    
    	const handleKeyboardPress = (e) => {    

            //Enter button.
            if (e.keyCode === 13) {

                //Check if command is special.
                var args = e.target.value.replace(/\s*\s/g, ' ').trim().split(' ')
                if (args[0] == './siac' || args[0] == 'siac'){ args.shift() }

                //Can't dp a simple match since command may have additional flags passed to it.
                if ( specialCommands.reduce( (isSpecial, command, j) =>
                    isSpecial || command.reduce(
                        (matches, argument, i) => (matches && argument === args[i])
                    , true ),
                false) ){ 
                    if (args[0] === 'help'){ 
                        if (showCommandOverview){ actions.hideCommandOverview() }
                        else { actions.showCommandOverview() }
                        var newCommand = Map({ command: 'help', result: '', id: Math.floor(Math.random()*1000000) })
                        actions.addCommand(newCommand)
                    }
                    else { actions.showWalletPrompt() }
                }
    
                else {
                    //Spawn command defined in index.js.
                    spawnCommand(currentCommand, actions)
                }
            }

            //Up arrow.
            else if (e.keyCode == 38){
                actions.loadPrevCommand(e.target);
                var commandinput = document.getElementById('command-input')
                setTimeout(function (){
                    commandinput.setSelectionRange(commandinput.value.length, commandinput.value.length)
                }, 0)
            }
    
            //Down arrow.
            else if (e.keyCode == 40){
                actions.loadNextCommand(e.target);
                var commandinput = document.getElementById('command-input')
                setTimeout(function (){
                    commandinput.setSelectionRange(commandinput.value.length, commandinput.value.length)
                }, 0)
            }
        }
    
    	return (
            <input id='command-input' onChange={handleTextInput} onKeyDown={handleKeyboardPress} type='text' value={ currentCommand } autocomplete='on'></input>
    	)
    }
}

export default CommandInput

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
                switch (  isCommandSpecial(currentCommand, specialCommands) ){
                    case -1: //Regular command.
                        spawnCommand(currentCommand, actions) //Spawn command defined in index.js. 
                        break;

                    case 0: //wallet unlock
                    case 1: //wallet load seed
                        actions.showWalletPrompt()
                        break;

                    case 2: //help
                        if (showCommandOverview){ actions.hideCommandOverview() }
                        else { actions.showCommandOverview() }

                        //The command history won't actually show a help command so it is fine to add the command.
                        var newCommand = Map({ command: 'help', result: '', id: Math.floor(Math.random()*1000000) })
                        actions.addCommand(newCommand)
                        break;
                }
             }

            //Up arrow.
            else if (e.keyCode === 38){
                actions.loadPrevCommand(e.target);
                var commandinput = document.getElementById('command-input')
                setTimeout(function (){
                    commandinput.setSelectionRange(commandinput.value.length, commandinput.value.length)
                }, 0)
            }
    
            //Down arrow.
            else if (e.keyCode === 40){
                actions.loadNextCommand(e.target);
                var commandinput = document.getElementById('command-input')
                setTimeout(function (){
                    commandinput.setSelectionRange(commandinput.value.length, commandinput.value.length)
                }, 0)
            }
        }
    
    	return (
            <input id='command-input' onChange={handleTextInput} onKeyDown={handleKeyboardPress} type='text' value={ currentCommand } autoComplete='on' autoFocus='true'></input>
    	)
    }
}

export default CommandInput

import React from 'react'

//These commands need a password prompt.
const specialCommands = [ ["wallet", "unlock"], ["wallet", "load", "seed"] ]

const CommandInput = ({commandHistory, currentCommand, actions}) => {

    componentDidUpdate: {
        setTimeout(function (){
            var commandinput = document.getElementById("command-input")
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
                var args = e.target.value.split(" ")
                if ( specialCommands.reduce( (isSpecial, command) =>
                    isSpecial || command.reduce(
                        (matches, argument, i) => (matches && argument === args[i])
                    , true ),
                false) ){ actions.showWalletPrompt() }
    
                else {
                    //Spawn command defined in index.js.
                    spawnCommand(currentCommand, actions)
                }
            }

            //Up arrow.
            else if (e.keyCode == 38){
                actions.loadPrevCommand(e.target);
                var commandinput = document.getElementById("command-input")
                setTimeout(function (){
                    commandinput.setSelectionRange(commandinput.value.length, commandinput.value.length)
                }, 0)
            }
    
            //Down arrow.
            else if (e.keyCode == 40){
                actions.loadNextCommand(e.target);
                var commandinput = document.getElementById("command-input")
                setTimeout(function (){
                    commandinput.setSelectionRange(commandinput.value.length, commandinput.value.length)
                }, 0)
            }
        }
    
    	return (
            <input id="command-input" onChange={handleTextInput} onKeyDown={handleKeyboardPress} type="text" value={ currentCommand } autocomplete="on"></input>
    	)
    }
}

export default CommandInput

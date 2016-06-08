import React from 'react'
import { Map } from 'immutable'
const child_process = require('child_process')

const WalletPasswordPrompt = ({ showWalletPrompt, currentCommand, actions }) => {
    componentDidUpdate: {
        //Give DOM time to register the update.
        setTimeout(function (){ document.getElementById("wallet-passwd").focus() }, 1)
    }

    render: {
        const handleKeyboardPress = (e) => {
            if (e.keyCode == 13){
                //Grab input, spawn process, and pipe text field to stdin.
                console.log("SPECIAL COMMAND: " + currentCommand)
                //Create new command object. Id doesn't need to be unique, just can't be the same for adjacent commands.
                var newCommand = Map({ command: currentCommand, result: "", id: Math.floor(Math.random()*1000000) })
                actions.addCommand(newCommand)
    
                var siac = child_process.spawn("./siac", newCommand.get("command").split(" "), { cwd: siacLocation })
                siac.stdin.write( e.target.value )
                siac.stdin.end()

                //Update the UI when the process receives new ouput.
                siac.stdout.on("data", function (chunk){
                    console.log("Data chunk " + chunk)
                    actions.updateCommand(newCommand.get("command"), newCommand.get("id"), chunk)
                })
    
                siac.stderr.on("data", function (chunk){
                    console.log("Data chunk " + chunk)
                    actions.updateCommand(newCommand.get("command"), newCommand.get("id"), chunk)
                })
    
                var closed = false
                var streamClosed =  function (code){
                    if (!closed){
                        actions.updateCommand(newCommand.get("command"), newCommand.get("id"), `\nReturn code: ${code}`)
                        closed = true
                    }
                }
    
                siac.on("error", function (code){ console.log(`\tPROGRAM ERRORED`); streamClosed(code) })
                siac.on("close", function (code){ console.log(`\tPROGRAM CLOSED`); streamClosed(code) })

                actions.hideWalletPrompt()
            }
        }
    
        return (
            <div id="wallet-prompt" className={ 'modal ' + (showWalletPrompt ? '' : 'hidden') }>
                <div className="modal-message">
                    <h3>Wallet Password</h3>
                    <p>Please type your wallet password and press enter to continue.</p>
                    <input onKeyDown={handleKeyboardPress} id="wallet-passwd"></input>
                </div>
            </div>
        )
    }
}

export default WalletPasswordPrompt

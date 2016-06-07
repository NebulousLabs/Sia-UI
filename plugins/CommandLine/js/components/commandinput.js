import React from 'react'
import { Map } from 'immutable'
import { remote } from 'electron'
const child_process = require('child_process')
console.log(child_process)

var siacLocation = "/Users/John/Downloads/Sia-v0.6.0-beta-darwin-amd64/"
//var siacLocation = "/Users/John/Library/Developer/Xcode/DerivedData/siac-dgxqgvcofulitlgypgxsqvulfzuh/Build/Products/Debug/"

const CommandInput = ({actions}) => {
	const handleKeyboardPress = (e) => {
        if (e.keyCode === 13) {

            //Create new command object. Id doesn't need to be unique, just can't be the same for adjacent commands.
            var newCommand = Map({ command: e.target.value, result: "", id: Math.floor(Math.random()*1000000) })
            actions.addCommand(newCommand)
            e.target.value = "" //Clear input bar.

            var siac = child_process.spawn("./siac", newCommand.get("command").split(" "), { cwd: siacLocation })

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
        }
    }
	return (
        <input id="command-input" onKeyDown={handleKeyboardPress} type="text"></input>
	)
}

export default CommandInput

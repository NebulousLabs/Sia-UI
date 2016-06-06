import React from 'react'

const CommandInput = ({actions}) => {
	const handleKeyboardPress = (e) => {
        if (e.keyCode === 13) {
            //Clear console input and log command when user presses enter.
            var newCommand = { command: e.target.value, result: "No result... Or is there?" }
            actions.addCommand(newCommand)

            console.log(Date() + " " + e.target.value);
            e.target.value = ""
        }
    }
	return (
        <input onKeyDown={handleKeyboardPress} type="text"></input>
	)
}

export default CommandInput

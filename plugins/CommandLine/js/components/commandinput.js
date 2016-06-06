import React from 'react'

const CommandInput = ({actions}) => {
	const handleKeyboardPress = (e) => {
        if (e.keyCode === 13) {
            //Clear console input and log command when user presses enter.
            console.log(Date() + " " + e.target.value);
            e.target.value = ""
        }
    }
	return (
        <input onKeyDown={handleKeyboardPress} type="text"></input>
	)
}

export default CommandInput

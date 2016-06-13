import React from 'react'
const querystring = require("querystring")

const WalletSeedPrompt = ({ showSeedPrompt, currentCommand, actions }) => {
    componentDidUpdate: {
        //Give DOM time to register the update.
        if (showSeedPrompt){
            setTimeout(function (){
                var seedpasswd = document.getElementById('seed-passwd')
                seedpasswd.focus()
                seedpasswd.setSelectionRange(0, seedpasswd.value.length)
            }, 1)
        }
    }

    render: {
        const handleKeyboardPress = (e) => {
            if (e.keyCode === 13){
                //Grab input, spawn process, and pipe text field to stdin.
                console.log('SPECIAL COMMAND: ' + currentCommand)
                var siac = httpCommand(currentCommand, actions)

                siac.write(querystring.stringify({
                    "encryptionpassword": document.getElementById("wallet-passwd").value,
                    "seed": e.target.value,
                    "dictionary": "english"
                }))
                siac.end()
                actions.hideSeedPrompt()
            }
        }
    
        return (
            <div id='seed-prompt' className={ 'modal ' + (showSeedPrompt ? '' : 'hidden') }>
                <div className='modal-message'>
                    <h3>New seed</h3>
                    <p>Please type your new seed and press enter to continue.</p>
                    <input onKeyDown={handleKeyboardPress} type='password' id='seed-passwd'></input>
                </div>
            </div>
        )
    }
}

export default WalletSeedPrompt

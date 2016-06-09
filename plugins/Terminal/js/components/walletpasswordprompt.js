import React from 'react'

//This command needs a second prompt.
const moreSpecialCommands= [ ["wallet", "load", "seed"] ]

const WalletPasswordPrompt = ({ showWalletPrompt, currentCommand, actions }) => {
    componentDidUpdate: {
        //Give DOM time to register the update.
        if (showWalletPrompt){
            setTimeout(function (){
                var walletpasswd = document.getElementById("wallet-passwd")
                walletpasswd.focus()
                walletpasswd.setSelectionRange(0, walletpasswd.value.length)
            }, 1)
        }
    }

    render: {
        const handleKeyboardPress = (e) => {
            if (e.keyCode == 13){

                var args = currentCommand.split(" ")
                if ( moreSpecialCommands.reduce( (isSpecial, command) =>
                    isSpecial || command.reduce(
                        (matches, argument, i) => (matches && argument === args[i])
                    , true ),
                    false) ){
                    actions.showSeedPrompt()
                }

                else {
                    //Grab input, spawn process, and pipe text field to stdin.
                    console.log("SPECIAL COMMAND: " + currentCommand)
                    var siac = spawnCommand(currentCommand, actions)                
                    siac.stdin.write( e.target.value )
                    siac.stdin.end()
                }

                actions.hideWalletPrompt()
            }
        }
    
        return (
            <div id="wallet-prompt" className={ 'modal ' + (showWalletPrompt ? '' : 'hidden') }>
                <div className="modal-message">
                    <h3>Wallet Password</h3>
                    <p>Please type your wallet password and press enter to continue.</p>
                    <input onKeyDown={handleKeyboardPress} type="password" id="wallet-passwd"></input>
                </div>
            </div>
        )
    }
}

export default WalletPasswordPrompt

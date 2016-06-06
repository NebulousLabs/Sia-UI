import CommandHistoryListView from '../components/commandhistorylist.js'
import { connect } from 'react-redux'


import { List } from 'immutable'
var localCHistory = List([
    { command: "balrg", result: "more balarg", key: 0 },
    { command: "finished with this", result: "Are you certain?", key: 1 }
])


const mapStateToProps = (state) => {
    console.log(JSON.stringify(state.commandLineReducer.get("commandHistory")))
    return ({
	commandHistory: state.commandLineReducer.get("commandHistory"),
})

}

const CommandHistoryList = connect(mapStateToProps)(CommandHistoryListView)
export default CommandHistoryList

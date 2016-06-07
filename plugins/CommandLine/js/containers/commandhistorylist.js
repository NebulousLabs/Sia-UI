import CommandHistoryListView from '../components/commandhistorylist.js'
import { connect } from 'react-redux'


const mapStateToProps = (state) => {
    console.log(`Command History: ${JSON.stringify(state.commandLineReducer.get("commandHistory"))}`)
    return ({
	    commandHistory: state.commandLineReducer.get("commandHistory"),
    })
}

const CommandHistoryList = connect(mapStateToProps)(CommandHistoryListView)
export default CommandHistoryList

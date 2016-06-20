import CommandHistoryListView from '../components/commandhistorylist.js'
import { connect } from 'react-redux'


const mapStateToProps = (state) => ({
	commandHistory: state.commandLineReducer.get('commandHistory'),
})

const CommandHistoryList = connect(mapStateToProps)(CommandHistoryListView)
export default CommandHistoryList

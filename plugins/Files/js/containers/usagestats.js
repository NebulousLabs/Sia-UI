import UsageStatsView from '../components/usagestats.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	allowance: state.files.get('allowance'),
	spending: state.files.get('spending'),
})

const UsageStats = connect(mapStateToProps)(UsageStatsView)
export default UsageStats

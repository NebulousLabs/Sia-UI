import UsageStatsView from '../components/usagestats.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	storageusage: state.files.get('storageUsage'),
	storageavailable: state.files.get('storageAvailable'),
})

const UsageStats = connect(mapStateToProps)(UsageStatsView)
export default UsageStats

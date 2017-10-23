import UsageStatsView from '../components/usagestats.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	allowance: state.files.get('allowance'),
	downloadspending: state.files.get('downloadspending'),
	uploadspending: state.files.get('uploadspending'),
	storagespending: state.files.get('storagespending'),
	contractspending: state.files.get('contractspending'),
	unspent: state.files.get('unspent'),
	renewheight: state.files.get('renewheight'),
})

const UsageStats = connect(mapStateToProps)(UsageStatsView)
export default UsageStats

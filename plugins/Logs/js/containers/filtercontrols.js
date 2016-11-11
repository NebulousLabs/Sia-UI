import FilterControlsView from '../components/filtercontrols.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addLogFilters, removeLogFilters } from '../actions.js'

const mapStateToProps = (state) => ({
	logFilters: state.get('logFilters'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ addLogFilters, removeLogFilters }, dispatch),
})

const FilterControls = connect(mapStateToProps, mapDispatchToProps)(FilterControlsView)
export default FilterControls


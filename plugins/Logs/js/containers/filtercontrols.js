import FilterControlsView from '../components/filtercontrols.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setLogFilters, addLogFilters, removeLogFilters } from '../actions.js'

const mapStateToProps = (state) => ({
	logFilters: state.get('logFilters'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ setLogFilters, addLogFilters, removeLogFilters }, dispatch),
})

const FilterControls = connect(mapStateToProps, mapDispatchToProps)(FilterControlsView)
export default FilterControls


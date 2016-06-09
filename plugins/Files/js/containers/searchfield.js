import SearchFieldView from '../components/searchfield.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setSearchText } from '../actions/files.js'

const mapStateToProps = (state) => ({
	searchText: state.files.get('searchText'),
	path: state.files.get('path'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ setSearchText }, dispatch),
})

const SearchField = connect(mapStateToProps, mapDispatchToProps)(SearchFieldView)
export default SearchField

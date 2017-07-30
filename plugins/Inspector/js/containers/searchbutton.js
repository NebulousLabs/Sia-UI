import SearchButtonView from '../components/searchbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toggleSearchField, setSearchText } from '../actions/files.js'

const mapStateToProps = (state) => ({
	path: state.files.get('path'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ toggleSearchField, setSearchText }, dispatch),
})

const SearchButton = connect(mapStateToProps, mapDispatchToProps)(SearchButtonView)
export default SearchButton

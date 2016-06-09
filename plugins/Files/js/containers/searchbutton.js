import SearchButtonView from '../components/searchbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toggleSearchField } from '../actions/files.js'

const mapStateToProps = () => ({
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ toggleSearchField }, dispatch),
})

const SearchButton = connect(mapStateToProps, mapDispatchToProps)(SearchButtonView)
export default SearchButton

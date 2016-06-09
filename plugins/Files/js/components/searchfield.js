import React, { PropTypes } from 'react'

const SearchField = ({searchText, actions}) => {
	const onSearchChange = (e) => actions.setSearchText(e.target.value)
	return (
		<div className="search-field">
			<input value={searchText} onChange={onSearchChange}></input>
		</div>
	)
}

SearchField.propTypes = {
	searchText: PropTypes.string.isRequired,
}
export default SearchField
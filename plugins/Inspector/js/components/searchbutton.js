import React from 'react'

const SearchButton = ({path, actions}) => {
	const handleClick = () => {
		actions.toggleSearchField()
		actions.setSearchText('', path)
	}
	return (
		<div onClick={handleClick} className="search-button">
			<i className="fa fa-search fa-2x" />
			<span> Search Files </span>
		</div>
	)
}

export default SearchButton

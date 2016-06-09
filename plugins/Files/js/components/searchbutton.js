import React from 'react'

const SearchButton = ({actions}) => {
	const handleClick = () => actions.toggleSearchField()
	return (
		<div onClick={handleClick} className="search-button">
			<i className="fa fa-search fa-2x"></i>
			<span> Search Files </span>
		</div>
	)
}

export default SearchButton

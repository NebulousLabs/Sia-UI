import React, { PropTypes } from 'react'

const FilterControl = ({ name, filters, checked, onFilterClick }) => {
	console.log(checked)
	return (
	<div className="filter-control">
		<span> {name} </span>
		<input type="checkbox" onChange={onFilterClick(filters)} checked={checked} />
	</div>
	)
}

FilterControl.propTypes = {
	name: PropTypes.string.isRequired,
	filters: PropTypes.array.isRequired,
	checked: PropTypes.bool.isRequired,
	onFilterClick: PropTypes.func.isRequired,
}

export default FilterControl



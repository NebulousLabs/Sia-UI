import React, { PropTypes } from 'react'

const filterControlStyle = {
	width: '100px',
	height: '50px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}

const FilterControl = ({ name, filters, checked, onFilterClick }) => (
	<div style={filterControlStyle}>
		<span> {name} </span>
		<div style={filterButtonStyle} onChange={onFilterClick(filters)} checked={checked} />
	</div>
)

FilterControl.propTypes = {
	name: PropTypes.string.isRequired,
	filters: PropTypes.array.isRequired,
	checked: PropTypes.bool.isRequired,
	onFilterClick: PropTypes.func.isRequired,
}

export default FilterControl


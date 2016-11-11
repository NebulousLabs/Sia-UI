import React, { PropTypes } from 'react'

const FilterControl = ({ name, filters, checked, addLogFilters, removeLogFilters, setLogFilters}) => {
	const filterControlStyle = {
		width: '100px',
		height: '50px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		borderTop: checked ? '3px solid #00CBA0' : '1px solid #00CBA0',
	}
	const onFilterClick = (filters) => (e) => {
		if (!e.ctrlKey && !e.shiftKey) {
			setLogFilters(filters)
			return
		}
		if (checked) {
			removeLogFilters(filters)
			return
		}
		addLogFilters(filters)
	}
	return (
		<div style={filterControlStyle} onClick={onFilterClick(filters)}>
			<span style={{WebkitUserSelect: 'none'}}> {name} </span>
		</div>
	)
}

FilterControl.propTypes = {
	name: PropTypes.string.isRequired,
	filters: PropTypes.array.isRequired,
	checked: PropTypes.bool.isRequired,
	addLogFilters: PropTypes.func.isRequired,
	removeLogFilters: PropTypes.func.isRequired,
	setLogFilters: PropTypes.func.isRequired,
}

export default FilterControl


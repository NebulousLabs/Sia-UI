import PropTypes from 'prop-types'
import React from 'react'
import { Set } from 'immutable'
import FilterControl from './filtercontrol'
import { filters } from '../filters.js'

const filterControlsStyle = {
	width: '100%',
	position: 'absolute',
	top: '0',
	margin: '0',
	padding: '0',
	backgroundColor: '#ECECEC',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}

const FilterControls = ({logFilters, actions}) => (
	<div style={filterControlsStyle}>
		{
			filters.map((filter, key) => (
				<FilterControl
					name={filter.name}
					filters={filter.filters}
					checked={filter.filters.reduce((isChecked, filtertext) => isChecked || logFilters.includes(filtertext), false)}
					addLogFilters={actions.addLogFilters}
					removeLogFilters={actions.removeLogFilters}
					setLogFilters={actions.setLogFilters}
					key={key}
				/>
			))
		}
	</div>
)


FilterControls.propTypes = {
	logFilters: PropTypes.instanceOf(Set).isRequired,
}

export default FilterControls


import React, { PropTypes } from 'react'
import { Set } from 'immutable'
import FilterControl from './filtercontrol'

const filterButtons = [
	{
		name: 'Consensus',
		filters: ['consensus.log'],
	},
	{
		name: 'Gateway',
		filters: ['gateway.log'],
	},
	{
		name: 'Host',
		filters: ['host.log', 'storagemanager.log'],
	},
	{
		name: 'Renter',
		filters: ['renter/contractor.log', 'renter/hostdb.log', 'renter.log'],
	},
	{
		name: 'Miner',
		filters: ['miner.log'],
	},
	{
		name: 'Wallet',
		filters: ['wallet.log'],
	},
]

const FilterControls = ({logFilters, actions}) => {
	const onFilterClick = (filters) => (e) => {
		if (e.target.checked) {
			actions.addLogFilters(filters)
			return
		}
		actions.removeLogFilters(filters)
	}
	return (
		<div className="filter-controls">
			{
				filterButtons.map((filter, key) => (
					<FilterControl
						name={filter.name}
						filters={filter.filters}
						checked={filter.filters.reduce((isChecked, filtertext) => isChecked || logFilters.includes(filtertext), false)}
						onFilterClick={onFilterClick}
						key={key}
					/>
				))
			}
		</div>
	)
}

FilterControls.propTypes = {
	logFilters: PropTypes.instanceOf(Set).isRequired,
}

export default FilterControls


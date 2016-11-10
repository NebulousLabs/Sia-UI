import React, { PropTypes } from 'react'
import { Set } from 'immutable'


const FilterControls = ({logFilters, actions}) => {
	const onFilterClick = (filtertext) => (e) => {
		if (e.target.checked) {
			actions.addLogFilter(filtertext)
			return
		}
		actions.removeLogFilter(filtertext)
	}
	return (
		<div className="filter-controls">
			Consensus<input type="checkbox" onChange={onFilterClick('consensus.log')} checked={logFilters.includes('consensus.log')} />
			Gateway<input type="checkbox" onChange={onFilterClick('gateway.log')} checked={logFilters.includes('gateway.log')} />
			Host<input type="checkbox" onChange={onFilterClick('host.log')} checked={logFilters.includes('host.log')} />
			Miner<input type="checkbox" onChange={onFilterClick('miner.log')} checked={logFilters.includes('miner.log')} />
			Renter<input type="checkbox" onChange={onFilterClick('renter.log')} checked={logFilters.includes('renter.log')} />
			Wallet<input type="checkbox" onChange={onFilterClick('wallet.log')} checked={logFilters.includes('wallet.log')} />
		</div>
	)
}

FilterControls.propTypes = {
	logFilters: PropTypes.instanceOf(Set).isRequired,
}

export default FilterControls


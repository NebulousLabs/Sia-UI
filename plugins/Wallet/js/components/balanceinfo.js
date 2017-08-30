import React from 'react'
import PropTypes from 'prop-types'

const BalanceInfo = ({synced, confirmedbalance, unconfirmedbalance, siafundbalance, siacoinclaimbalance}) => (
	<div className="balance-info">
		<span>Confirmed Balance: {confirmedbalance} SC </span>
		<span>Unconfirmed Delta: {unconfirmedbalance} SC </span>
		{siafundbalance !== '0' ? (<span> Siafund Balance: {siafundbalance} SF </span>) : null}
		{!synced ? (
			<span style={{marginRight: '40px', color: 'rgb(255, 93, 93)'}} className="fa fa-exclamation-triangle">Your wallet is not synced, balances are not final.</span>
		) : null
		}
	</div>
)
BalanceInfo.propTypes = {
	synced: PropTypes.bool.isRequired,
	confirmedbalance: PropTypes.string.isRequired,
	unconfirmedbalance: PropTypes.string.isRequired,
	siafundbalance: PropTypes.string.isRequired,
	siacoinclaimbalance: PropTypes.string.isRequired,
}
export default BalanceInfo


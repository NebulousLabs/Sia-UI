import React from 'react'
import PropTypes from 'prop-types'

const BalanceInfo = ({synced, confirmedbalance, unconfirmedbalance, siafundbalance, siacoinclaimbalance}) => (
	<div className="balance-info">
		<div>
			<span className="balance-info__main-label">Available Balance</span>
			<div>
				<span className="balance-info__main-balance">{confirmedbalance}</span>
				<span className="balance-info__main-balance-currency">SC</span>
			</div>
			{unconfirmedbalance !== '0' || true
				&& <span className="balance-info__unconfirmed-balance">{unconfirmedbalance}<sup> SC</sup></span>
			}
		</div>
		<div className="balance-info__addendum">
			{siafundbalance !== '0' ? (<div> Siafund Balance: {siafundbalance} SF </div>) : null}
			{siacoinclaimbalance !== '0' ? (<div> Siacoin Claim Balance: {siacoinclaimbalance} SC </div>) : null}
		</div>
		{!synced ? (
			<span style={{marginRight: 40, color: 'rgb(255, 93, 93)', fontSize: 12}}><i className="fa fa-exclamation-triangle" />Your wallet is not synced, balances are not final.</span>
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


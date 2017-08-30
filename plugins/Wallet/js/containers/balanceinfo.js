import BalanceInfoView from '../components/balanceinfo.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	synced: state.wallet.get('synced'),
	confirmedbalance: state.wallet.get('confirmedbalance'),
	unconfirmedbalance: state.wallet.get('unconfirmedbalance'),
	siafundbalance: state.wallet.get('siafundbalance'),
	siacoinclaimbalance: state.wallet.get('siacoinclaimbalance'),
})
const mapDispatchToProps = () => ({
})

const BalanceInfo = connect(mapStateToProps, mapDispatchToProps)(BalanceInfoView)
export default BalanceInfo 

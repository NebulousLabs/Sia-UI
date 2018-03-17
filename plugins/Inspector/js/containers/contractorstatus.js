import ContractorStatusView from '../components/contractorstatus.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	settingAllowance: state.files.get('settingAllowance'),
	contractCount: state.files.get('contractCount'),
})

const ContractorStatus = connect(mapStateToProps)(ContractorStatusView)
export default ContractorStatus


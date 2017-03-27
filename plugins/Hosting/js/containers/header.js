import HeaderView from '../components/header.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	numContracts: state.hostingReducer.get('numContracts'),
	storage: state.hostingReducer.get('storage'),
	earned: state.hostingReducer.get('earned'),
	expected: state.hostingReducer.get('expected'),
	walletsize: state.hostingReducer.get('walletsize'),
	walletLocked: state.hostingReducer.get('walletLocked'),
	hostOnline: state.hostingReducer.get('online'),
})

const Header = connect(mapStateToProps)(HeaderView)
export default Header

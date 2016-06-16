import HeaderView from '../components/header.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
    numContracts: state.hostingReducer.get('numContracts'),
    storage: state.hostingReducer.get('storage'),
})

const Header = connect(mapStateToProps)(HeaderView)
export default Header

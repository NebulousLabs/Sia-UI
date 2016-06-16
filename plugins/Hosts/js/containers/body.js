import BodyView from '../components/body.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
    usersettings: state.hostingReducer.get('usersettings'),
})

const Body = connect(mapStateToProps)(BodyView)
export default Body

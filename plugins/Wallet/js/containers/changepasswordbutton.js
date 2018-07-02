import ChangePasswordButtonView from '../components/changepasswordbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showChangePasswordDialog } from '../actions/wallet.js'

const mapStateToProps = () => ({})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ showChangePasswordDialog }, dispatch)
})

const ChangePasswordButton = connect(mapStateToProps, mapDispatchToProps)(
  ChangePasswordButtonView
)
export default ChangePasswordButton

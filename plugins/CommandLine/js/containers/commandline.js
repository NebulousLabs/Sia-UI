import CommandLineView from '../components/commandline.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({})
const CommandLine = connect(mapStateToProps)(CommandLineView)
export default CommandLine

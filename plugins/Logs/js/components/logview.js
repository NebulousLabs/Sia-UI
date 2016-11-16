import React, { PropTypes } from 'react'

const logViewStyle = {
	position: 'absolute',
	top: '60px',
	bottom: '55px',
	left: '2px',
	right: '0',
	margin: '0',
	padding: '0',
	overflowY: 'scroll',
	whiteSpace: 'pre',
	fontSize: '12px',
	fontFamily: 'monospace',
}

export default class LogView extends React.Component {
	componentDidUpdate() {
		this._logView.scrollTop = this._logView.scrollHeight
	}
	componentDidMount() {
		this._logView.scrollTop = this._logView.scrollHeight
	}
	render() {
		return (
			<div style={logViewStyle} ref={(lv) => this._logView = lv}>
				{this.props.logText}
			</div>
		)
	}
}

LogView.propTypes = {
	logText: PropTypes.string.isRequired,
}


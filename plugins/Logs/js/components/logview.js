import PropTypes from 'prop-types'
import React from 'react'

const logViewStyle = {
	position: 'absolute',
	top: '55px',
	bottom: '0',
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
	componentDidMount() {
		this._logView.scrollTop = this._logView.scrollHeight
		this._logView.addEventListener('scroll', this.handleScroll.bind(this))
	}
	componentDidUpdate() {
		if (!this.props.scrolling) {
			this._logView.scrollTop = this._logView.scrollHeight
		}
	}
	handleScroll() {
		if (this._logView.scrollTop === 0) {
			this.props.actions.incrementLogSize()
			this._logView.scrollTop = 1
		}
		if (this._logView.scrollTop === this._logView.scrollHeight - this._logView.clientHeight) {
			this.props.actions.setNotScrolling()
		} else {
			this.props.actions.setScrolling()
		}
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
	scrolling: PropTypes.bool.isRequired,
}


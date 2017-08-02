import PropTypes from 'prop-types'
import React from 'react'
import Tooltip from 'rc-tooltip'
import { CloseButton } from 'react-svg-buttons'

const logViewStyle = {
	position: 'absolute',
	top: '20px',
	bottom: '0',
	left: '20px',
	right: '20px',
	margin: '0',
	padding: '0',
	overflowY: 'scroll',
	whiteSpace: 'pre',
	fontSize: '12px',
	fontFamily: 'monospace',
}

const reapirFileViewStyle = {
	margin: '10px 20px',
}

const repaireChunkStyle = {
	width: '8px',
	height: '8px',
	float: 'left',
	border: 'solid 1px #001f3f',
}

const repairChunkRepairedStyle = {
	...repaireChunkStyle,
	background: '#01FF70',
}

const repairChunkRepairingStyle = {
	...repaireChunkStyle,
	background: '#FF851B',
}

const repairChunkQueuedStyle = {
	...repaireChunkStyle,
	background: 'white',
}

const clearBothStyle = {
	clear: 'both',
}

const pieceOnlineStyle = {
	color: '#01FF70',
}

const pieceOfflineStyle = {
	color: '#dc143c',
}

const pieceEmptyStyle = {
	color: 'white',
}

const closeButtonStyle = {
	float: 'right',
	cursor: 'pointer',
}

const FileDetail = ({showDetailFile, actions}) => {
	const closeDetail = actions.closeFileDetail
	const getChunkTooltip = (chunk) => chunk.map((piece, i) => {
		if (piece.length === 0) {
			return (<div style={pieceEmptyStyle} key={i}>Empty</div>)
		}
		const line = piece.map((ele, j) => {
			let s
			if (ele.isoffline) {
				s = pieceOfflineStyle
			} else {
				s = pieceOnlineStyle
			}
			return (<div style={s} key={j}>{ele.host};</div>)
		})
		return (<div key={i}>{line}</div>)
	})
	const getChunkStyle = (chunk) => {
		const onlinePiece = chunk.reduce((sum, piece) => piece.some((ele) => ele.host && !ele.isoffline) ? sum+1: sum, 0)
		if (onlinePiece === chunk.length) {
			return repairChunkRepairedStyle
		}
		if (onlinePiece === 0) {
			return repairChunkQueuedStyle
		}
		return repairChunkRepairingStyle
	}
	const details = showDetailFile.details
	return (
		<div style={logViewStyle}>
			<div style={closeButtonStyle}>
				<CloseButton onClick={closeDetail} thickness={2} color="#ff0000" />
			</div>
			<div style={clearBothStyle} />
			<h4>
				{showDetailFile.name}
			</h4>
			<div style={reapirFileViewStyle}>
				{details.map((v, i) => (
					<Tooltip placement="rightTop" overlay={getChunkTooltip(v)} key={i}>
						<a style={getChunkStyle(v)} />
					</Tooltip>)
				)}
				<div style={clearBothStyle} />
			</div>
		</div>
	)
}

FileDetail.propTypes = {
	showDetailFile: PropTypes.object.isRequired,
}

export default FileDetail


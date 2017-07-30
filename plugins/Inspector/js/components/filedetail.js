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
	const getChunkTooltip = (chunk) => chunk.map(
			(piece, i) => {
				let s
				if (!piece.host) {
					s = pieceEmptyStyle
				} else if (piece.isoffline) {
					s = pieceOfflineStyle
				} else {
					s = pieceOnlineStyle
				}
				return (<div style={s} key={i}>{piece.host ? piece.host : 'Empty'}</div>)
			}
	)
	const getChunkStyle = (chunk) => {
		const onlineChunk = chunk.reduce((sum, piece) => {
			if (piece.host && !piece.isoffline) {
				return sum+1
			}
			return sum
		}, 0)
		if (onlineChunk === chunk.length) {
			return repairChunkRepairedStyle
		}
		if (onlineChunk === 0) {
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


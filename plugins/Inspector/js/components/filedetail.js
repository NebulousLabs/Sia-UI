import PropTypes from 'prop-types'
import React from 'react'
import * as constants from '../constants/files.js'
import Tooltip from 'rc-tooltip'
import { CloseButton } from 'react-svg-buttons'
import Pagination from 'react-paginate'
import Select from 'rc-select'

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

const FileDetail = ({showDetailPath, showDetailFile, actions}) => {
	const closeDetail = actions.closeFileDetail
	const onChangeOrSizeChange = (current, pageSize) => {
		actions.fetchFileDetail(showDetailPath, pageSize, current)
	}
	const onChange = (current) => {
		actions.fetchFileDetail(showDetailPath, constants.DEFAULT_PAGE_SIZE, current)
	}

	if (!showDetailFile) {
		actions.fetchFileDetail(showDetailPath, constants.DEFAULT_PAGE_SIZE, 1)
		return (
			<div className="file-list">
				<div style={closeButtonStyle}>
					<CloseButton onClick={closeDetail} thickness={2} color="#ff0000" />
				</div>
				<div style={clearBothStyle} />
				<ul>
					<h2> Loading file detail... </h2>
				</ul>
			</div>
		)
	}

	const getHost = (idx) => {
		return showDetailFile.details.hosts[idx]
	}

	const getChunkTooltip = (chunk) => chunk.map((piece, i) => {
		if (!piece || piece.length === 0) {
			return (<div style={pieceEmptyStyle} key={i}>Empty</div>)
		}
		const line = piece.map((ele, j) => {
			let s
			ele = getHost(ele)
			if (ele.isoffline) {
				s = pieceOfflineStyle
			} else {
				s = pieceOnlineStyle
			}
			return (<span style={s} key={j}>{ele.host};</span>)
		})
		return (<div key={i}>{i}: {line}</div>)
	})
	const getChunkStyle = (chunk) => {
		const onlinePiece = chunk.reduce((sum, piece) => piece.some((ele) => getHost(ele).host && !getHost(ele).isoffline) ? sum+1: sum, 0)
		if (onlinePiece === chunk.length) {
			return repairChunkRepairedStyle
		}
		if (onlinePiece === 0) {
			return repairChunkQueuedStyle
		}
		return repairChunkRepairingStyle
	}

	return (
		<div style={logViewStyle}>
			<div style={closeButtonStyle}>
				<CloseButton onClick={closeDetail} thickness={2} color="#ff0000" />
			</div>
			<div style={clearBothStyle} />
			<h4>
				{showDetailFile.name}
			</h4>
			<Pagination
		    selectComponentClass={Select}
		    showQuickJumper
		    showSizeChanger
		    defaultPageSize={constants.DEFAULT_PAGE_SIZE}
		    defaultCurrent={1}
		    onShowSizeChange={onChangeOrSizeChange}
		    onChange={onChangeOrSizeChange}
		    total={showDetailFile.total}
		  />
			<div style={reapirFileViewStyle}>
				{showDetailFile.details.chunks.map((chunk, i) => (
					<Tooltip placement="rightTop" overlay={getChunkTooltip(chunk)} key={i}>
						<a style={getChunkStyle(chunk)} />
					</Tooltip>)
				)}
				<div style={clearBothStyle} />
			</div>
		</div>
	)
}

FileDetail.propTypes = {
	showDetailPath: PropTypes.string.isRequired,
}

export default FileDetail

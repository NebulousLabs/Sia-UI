import PropTypes from 'prop-types'
import React from 'react'
import FileDetailTip from './filedetailtip.js'
import * as constants from '../constants/files.js'
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
	width: '10px',
	height: '10px',
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

const closeButtonStyle = {
	float: 'right',
	cursor: 'pointer',
}

const FileDetail = ({showDetailPath, showDetailFile, current, actions}) => {
	const closeDetail = actions.closeFileDetail

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

	const getHost = (idx) => showDetailFile.details.hosts[idx]

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
	const links = Array.from(new Array(showDetailFile.totalpages), (val, index) => {
		if (index+1 === current) {
			return (<a key={index} > {index+1} </a>)
		}
		const onChange = () => {
			actions.fetchFileDetail(showDetailPath, constants.DEFAULT_PAGE_SIZE, index+1)
		}
		return (<a key={index} href="#" onClick={onChange()}> {index+1} </a>)
	})

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
				{links}
			</div>

			<div style={reapirFileViewStyle}>
				{showDetailFile.details.chunks.map((chunk, i) => (
					<Tooltip
						placement="rightTop"
						key={i}
						overlay={
							<FileDetailTip
								chunk={chunk}
								getHost={getHost}
								current={current}
								index={i}
							/>
						}
					>
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

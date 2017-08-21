import PropTypes from 'prop-types'
import React from 'react'
import * as constants from '../constants/files.js'

const pieceOnlineStyle = {
	color: '#01FF70',
}

const pieceOfflineStyle = {
	color: '#dc143c',
}

const pieceEmptyStyle = {
	color: 'white',
}

const FileDetailTip = ({chunk, index, current, getHost}) => {
	const tip = chunk.map((piece, i) => {
		if (!piece || piece.length === 0) {
			return (<div style={pieceEmptyStyle} key={i}>Empty</div>)
		}
		const line = piece.map((ele, j) => {
			let s
			if (getHost(ele).isoffline) {
				s = pieceOfflineStyle
			} else {
				s = pieceOnlineStyle
			}
			return (<span style={s} key={j}>{getHost(ele).host};</span>)
		})
		return (<div key={i}>{i}: {line}</div>)
	})

	return (
		<div>
			<div>ChunkId : {(current - 1) * constants.DEFAULT_PAGE_SIZE + index}</div>
			{tip}
		</div>
	)
}

FileDetailTip.propTypes = {
	chunk: PropTypes.array.isRequired,
	index: PropTypes.number.isRequired,
	current: PropTypes.number.isRequired,
	getHost: PropTypes.func.isRequired,
}

export default FileDetailTip

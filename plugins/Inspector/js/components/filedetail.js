import PropTypes from 'prop-types'
import React from 'react'
import Tooltip from 'rc-tooltip';

const FileDetail = ({showDetailFile}) => {
    const getChunkTooltip = chunk => chunk.map(
        (piece, i) => {
            var s;
            if(!piece.host) {
                s = pieceEmpty
            } else if(piece.isoffline) {
                s = pieceOffline
            } else {
                s = pieceOnline
            }
            return (<div style={s} key={i}>{piece.host ? piece.host : "Empty"}</div>)
        }
    )
    const getChunkStyle = chunk => {
        const onlineChunk = chunk.reduce((sum, piece) => {
            if(piece.host && !piece.isoffline) {
                return sum+1
            }
            return sum
        }, 0)
        if(onlineChunk == chunk.length) {
            return repairChunkRepaired
        }
        if(onlineChunk == 0) {
            return repairChunkQueued
        }
        return repairChunkRepairing
    }
    const details = showDetailFile.details
    return (
        <div style={logViewStyle}>
            <h4>
                {showDetailFile.name}
            </h4>
            <div style={reapirFileView}>
                {details.map((v,i) => (
                  <Tooltip placement="rightTop" overlay={getChunkTooltip(v)} key={i}>
                    <a style={getChunkStyle(v)}>
                    </a>
                  </Tooltip>)
                  )}
                <div style={clearBoth}></div>
            </div>
        </div>
    )
}

FileDetail.propTypes = {
    showDetailFile: PropTypes.object.isRequired,
}

export default FileDetail

const logViewStyle = {
    position: 'absolute',
    top: '55px',
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

const liViewStyle = {
    cursor: 'pointer',
}

const reapirFileView = {
    margin: '10px 20px',
}

const repaireChunk = {
    width: '8px',
    height: '8px',
    float: 'left',
    border: 'solid 1px #001f3f',
}

const repairChunkRepaired = {
    ...repaireChunk,
    background: '#01FF70',
}

const repairChunkRepairing = {
    ...repaireChunk,
    background: '#FF851B',
}

const repairChunkQueued = {
    ...repaireChunk,
    background: 'white',
}

const clearBoth = {
    clear: 'both',
}

const pieceOnline = {
    color: '#01FF70'
}

const pieceOffline = {
    color: '#dc143c'
}

const pieceEmpty = {
    color: 'white'
}
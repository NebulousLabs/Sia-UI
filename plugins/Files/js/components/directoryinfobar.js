import PropTypes from 'prop-types'
import React from 'react'

const colorBackDisabled = '#C5C5C5'
const colorBackEnabled = '#00CBA0'

const DirectoryInfoBar = ({path, nfiles, onBackClick}) => {
	const backButtonStyle = {
		color: (() => {
			if (path === '') {
				return colorBackDisabled
			}
			return colorBackEnabled
		})(),
	}
	return (
		<li className="directory-infobar">
			<div style={{cursor: 'pointer'}} className="back-button" onClick={onBackClick}>
				<i className="fa fa-backward" style={backButtonStyle} />
				<span>Back</span>
			</div>
			<div className="directory-info">
				<span style={{marginRight: '10px'}}> {path} </span>
				<span style={{marginRight: '10px'}}> {nfiles} {nfiles === 1 ? 'file' : 'files' }</span>
			</div>
		</li>
	)
}

DirectoryInfoBar.propTypes = {
	path: PropTypes.string.isRequired,
	nfiles: PropTypes.number.isRequired,
	onBackClick: PropTypes.func.isRequired,
}

export default DirectoryInfoBar

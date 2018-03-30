import PropTypes from 'prop-types'
import React from 'react'

const colorBackDisabled = '#C5C5C5'
const colorBackEnabled = 'var(--main-color)'

const DirectoryInfoBar = ({path, nfiles, onBackClick, setDragFolderTarget}) => {
	const backButtonStyle = {
		color: (() => {
			if (path === '') {
				return colorBackDisabled
			}
			return colorBackEnabled
		})(),
	}
	// handle file drag onto the info bar: move the file into the parent
	// directory
	const handleDragOver = () => {
		setDragFolderTarget('../')
	}
	return (
		<li onDragOver={handleDragOver} className="directory-infobar">
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
	setDragFolderTarget: PropTypes.func.isRequired,
}

export default DirectoryInfoBar

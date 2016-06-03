import React, { PropTypes } from 'react'

const FilesApp = ({unlocked}) => {
	let filesContent
	if (!unlocked) {
		filesContent = (
			<div className="unlock-dialog">
				You must unlock your wallet you can upload files!
			</div>
		)
	}
	return (
		<div className="app">
			{filesContent}
		</div>
	)
}

FilesApp.propTypes = {
	unlocked: PropTypes.bool.isRequired,
}

export default FilesApp

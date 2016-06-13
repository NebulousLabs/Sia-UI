import React, { PropTypes } from 'react'
import { List } from 'immutable'

const DownloadsList = ({downloads}) => {
	console.log('re-rendering')
	const downloadsComponents = downloads.map((download, key) => (
		<li key={key}>
			<div className="filename">{download.name}</div>
			<div className="download-state">{download.state}</div>
			<div className="progress">{download.progress}%</div>
		</li>
	))
	return (
		<div className="downloads-list">
			<ul>
				{downloadsComponents}
			</ul>
		</div>
	)
}

DownloadsList.propTypes = {
	downloads: PropTypes.instanceOf(List).isRequired,
}

export default DownloadsList

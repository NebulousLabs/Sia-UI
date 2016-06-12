import React, { PropTypes } from 'react'
import { List } from 'immutable'

const DownloadsList = ({downloads}) => {
	const downloadsComponents = downloads.map((download, key) => (
		<li key={key}>
			<div className="completed">{transfer.completed}</div>
			<div className="filename">{transfer.name}</div>
			<div className="progress">{transfer.progress}%</div>
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

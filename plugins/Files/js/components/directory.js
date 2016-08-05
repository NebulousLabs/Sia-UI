import React, { PropTypes } from 'react'

const Directory = ({onClick, name}) => (
	<li onClick={onClick}>
		<div className="filename">
			<i className="fa fa-folder" />
			{name}
		</div>
	</li>
)

Directory.propTypes = {
	onClick: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
}

export default Directory

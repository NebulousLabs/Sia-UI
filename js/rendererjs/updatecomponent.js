import React, { PropTypes } from 'react'

const UpdateComponent = ({onClick = () => {}}) => (
	<div className="updater-component" onClick={onClick}>
		<i className="fa fa-upload fa-2x"></i>
		<div className="version-status-text">Update Available</div>
	</div>
)

UpdateComponent.propTypes = {
	onClick: PropTypes.func,
}

export default UpdateComponent

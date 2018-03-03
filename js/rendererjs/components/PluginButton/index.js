import React from 'react'

export default (props) => (
	<div
		id={`${props.title}-button`}
		className="button"
		onClick={props.onClick}
	>
		<img
			className="icon"
			src={props.iconPath}
		/>
		<div className="text">
			{props.title}
		</div>
	</div>
)


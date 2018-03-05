import React from 'react'
import Transition from 'react-addons-css-transition-group'

export default (props) => (
	<Transition
		style={{
			// make interaction pass through if empty
			pointerEvents: !props.open ?  'none' : 'initial',
		}}
		className="modal"
		transitionName="modal"
		transitionEnterTimeout={225}
		transitionLeaveTimeout={195}
	>
		{props.open
			&& <div key="backdrop" className="modal__backdrop" aria-hidden="true" />}
		{props.open
			&& (
				<div key="content">
					{React.cloneElement(props.children)}
				</div>
			)
		}
	</Transition>
)

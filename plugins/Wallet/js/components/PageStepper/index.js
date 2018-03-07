import React from 'react'

class PageStepper extends React.Component {
	render() {
		const { props } = this

		return (
			<div className="page-stepper">
				{props.children}
			</div>
		)
	}
}

export default PageStepper

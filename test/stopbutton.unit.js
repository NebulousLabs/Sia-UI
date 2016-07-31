import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import StopButton from '../js/rendererjs/stopbutton.js'

describe('stop button component', () => {
	it('renders a .stop-button', () => {
		expect(shallow(<StopButton stopSiad={spy()} />).find('.stop-button')).to.have.length(1)
	})
	it('calls stopSiad when clicked', () => {
		const stopSpy = spy()
		const stopComponent = shallow(<StopButton stopSiad={stopSpy} />)
		stopComponent.find('.stop-button').first().simulate('click')
		expect(stopSpy.called).to.be.true
	})
})

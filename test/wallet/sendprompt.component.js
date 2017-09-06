/* eslint-disable no-unused-expressions */
import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import SendPrompt from '../../plugins/Wallet/js/components/sendprompt.js'

const testActions = {
	setSendAddress: spy(),
	setSendAmount: spy(),
	sendCurrency: spy(),
	closeSendPrompt: spy(),
	setSendError: spy(),
}

const sendpromptComponentSC = shallow(<SendPrompt currencytype="siacoins" sendAddress="testaddr" sendAmount="1" sendError="" actions={testActions} />)
const sendpromptComponentSF = shallow(<SendPrompt currencytype="siafunds" sendAddress="testaddr" sendAmount="1" sendError="" actions={testActions} />)

describe('wallet send prompt component', () => {
	it('renders a modal with one child', () => {
		expect(sendpromptComponentSC.find('.modal')).to.have.length(1)
	})
	it('renders send amount with the correct currency', () => {
		expect(sendpromptComponentSC.find('.sendamount h3').first().text()).to.contain('Send Amount (SC)')
		expect(sendpromptComponentSF.find('.sendamount h3').first().text()).to.contain('Send Amount (SF)')
	})
	it('renders send amount input with sendAmount value', () => {
		expect(sendpromptComponentSC.find('.sendamount input').first().props().value).to.equal('1')
	})
	it('renders a send-prompt-buttons div with two buttons', () => {
		expect(sendpromptComponentSC.find('.send-prompt-buttons').first().children()).to.have.length(2)
	})
	it('calls closeSendPrompt on cancel click', () => {
		sendpromptComponentSC.find('.cancel-send-button').first().simulate('click')
		expect(testActions.closeSendPrompt.called).to.be.true
	})
	it('calls sendCurrency with correct currency and value on send click', () => {
		sendpromptComponentSC.find('.send-siacoin-button').first().simulate('click')
		expect(testActions.sendCurrency.calledWith('testaddr', '1', 'siacoins')).to.be.true
		testActions.sendCurrency.reset()
		sendpromptComponentSF.find('.send-siacoin-button').first().simulate('click')
		expect(testActions.sendCurrency.calledWith('testaddr', '1', 'siafunds')).to.be.true
	})
	it('calls setSendAddress on sendaddress change', () => {
		sendpromptComponentSC.find('.sendaddress input').first().simulate('change', {target: {value: 'newaddress'}})
		expect(testActions.setSendAddress.calledWith('newaddress')).to.be.true
	})
	it('calls setSendAmount on sendamount change', () => {
		sendpromptComponentSC.find('.sendamount input').first().simulate('change', {target: {value: '100'}})
		expect(testActions.setSendAmount.calledWith('100')).to.be.true
	})
})
/* eslint-enable no-unused-expressions */

import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import PasswordPrompt from '../../plugins/Wallet/js/components/passwordprompt.js'

const testActions = {
	handlePasswordChange: spy(),
	unlockWallet: spy(),
}

describe('wallet password prompt component', () => {

})
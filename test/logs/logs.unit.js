import { readLog, cleanLog } from '../../plugins/Logs/js/logparse.js'
import { expect } from 'chai'
import Path from 'path'
import fs from 'fs'

describe('log parsing', () => {
	const consensusLog = Path.join(SiaAPI.config.siad.datadir, './consensus/consensus.log')
	const consensusLogText = cleanLog(fs.readFileSync(consensusLog, 'utf8'))
	describe('readLog', () => {
		it('reads logs given a log path', () => {
			expect(readLog(consensusLog).length > 0).to.equal(true)
			expect(readLog(consensusLog)).to.equal(consensusLogText)
		})
		it('reads logs given a log path and nbytes', () => {
			expect(readLog(consensusLog, fs.statSync(consensusLog).size)).to.equal(consensusLogText)
			expect(readLog(consensusLog, 2).indexOf('\n')).to.equal(-1)
			expect(readLog(consensusLog, 144).indexOf('\n') > -1).to.equal(true)
			expect(readLog(consensusLog, 5000000).length).to.equal(consensusLogText.length)
		})
	})
})

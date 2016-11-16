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
		it('reads logs given a log path and start, end', () => {
			expect(readLog(consensusLog, 0, fs.statSync(consensusLog).size)).to.equal(consensusLogText)
			expect(readLog(consensusLog, 16).length).to.equal(consensusLogText.length)
			expect(readLog(consensusLog, 16, 18).indexOf('\n')).to.equal(-1)
			expect(readLog(consensusLog, 0, 144).indexOf('\n') > -1).to.equal(true)
		})
	})
})

import { readLog } from '../../plugins/Logs/js/logparse.js'
import { expect } from 'chai'
import Path from 'path'
import fs from 'fs'


describe('log parsing', () => {
	const consensusLog = Path.join(SiaAPI.config.siad.datadir, './consensus/consensus.log')
	describe('readLog', () => {
		it('reads logs given a log path', () => {
			expect(readLog(consensusLog).length > 0).to.equal(true)
			expect(readLog(consensusLog)).to.equal(fs.readFileSync(consensusLog, 'utf8'))
		})
		it('reads logs given a log path and start, end', () => {
			expect(readLog(consensusLog, 0, fs.statSync(consensusLog).size)).to.equal(fs.readFileSync(consensusLog, 'utf8'))
			expect(readLog(consensusLog, 16).length).to.equal(fs.readFileSync(consensusLog).length - 16)
			expect(readLog(consensusLog, 16, 32).length).to.equal(16)
		})
	})
})

/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { allowanceStorage, estimatedStoragePriceGBSC, estimatedStoragePriceH } from '../../plugins/Files/js/sagas/helpers.js'
import { List } from 'immutable'
import Siad from 'sia.js'
import BigNumber from 'bignumber.js'

const size = 10 // 10 gb
const period = 12000

const hosts = List([
	{ storageprice: Siad.siacoinsToHastings(22000) },
	{ storageprice: Siad.siacoinsToHastings(211000) },
	{ storageprice: Siad.siacoinsToHastings(23000) },
	{ storageprice: Siad.siacoinsToHastings(21000) },
	{ storageprice: Siad.siacoinsToHastings(3000) },
	{ storageprice: Siad.siacoinsToHastings(4000) },
	{ storageprice: Siad.siacoinsToHastings(5000) },
	{ storageprice: Siad.siacoinsToHastings(10000) },
	{ storageprice: Siad.siacoinsToHastings(9000) },
	{ storageprice: Siad.siacoinsToHastings(10000) },
	{ storageprice: Siad.siacoinsToHastings(2000) },
	{ storageprice: Siad.siacoinsToHastings(200000) },
	{ storageprice: Siad.siacoinsToHastings(10000) },
	{ storageprice: Siad.siacoinsToHastings('100000000000000000000') },
	{ storageprice: Siad.siacoinsToHastings('313373133731337313373') },

])

describe('storage estimation', () => {
	before(() => {
		global.SiaAPI = {
			hastingsToSiacoins: Siad.hastingsToSiacoins,
			siacoinsToHastings: Siad.siacoinsToHastings,
		}
	})
	it('storage estimation calculations are isomorphic', () => {
		const priceGBSC = estimatedStoragePriceGBSC(hosts, size, period)
		expect(allowanceStorage(Siad.siacoinsToHastings(priceGBSC), hosts, period)).to.equal('10 GB')
	})
	it('filters outliers', () => {
		const unfilteredAverage = hosts.reduce((sum, host) => sum.add(host.storageprice), new BigNumber(0)).dividedBy(hosts.size)
		expect(estimatedStoragePriceH(hosts, 1, 100).lt(unfilteredAverage)).to.be.true
	})
})
/* eslint-enable no-unused-expressions */

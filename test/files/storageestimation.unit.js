import { expect } from 'chai'
import { allowanceStorage, estimatedStoragePriceGBSC, estimatedStoragePriceH } from '../../plugins/Files/js/sagas/helpers.js'
import { List } from 'immutable'
import Siad from 'sia.js'
import BigNumber from 'bignumber.js'

global.SiaAPI = {
	hastingsToSiacoins: Siad.hastingsToSiacoins,
	siacoinsToHastings: Siad.siacoinsToHastings,
}

const size = 10 // 10 gb
const period = 12000

const hosts = List([
	{ storageprice: SiaAPI.siacoinsToHastings(22000) },
	{ storageprice: SiaAPI.siacoinsToHastings(211000) },
	{ storageprice: SiaAPI.siacoinsToHastings(23000) },
	{ storageprice: SiaAPI.siacoinsToHastings(21000) },
	{ storageprice: SiaAPI.siacoinsToHastings(3000) },
	{ storageprice: SiaAPI.siacoinsToHastings(4000) },
	{ storageprice: SiaAPI.siacoinsToHastings(5000) },
	{ storageprice: SiaAPI.siacoinsToHastings(10000) },
	{ storageprice: SiaAPI.siacoinsToHastings(9000) },
	{ storageprice: SiaAPI.siacoinsToHastings(10000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(200000) },
	{ storageprice: SiaAPI.siacoinsToHastings(10000) },
	{ storageprice: SiaAPI.siacoinsToHastings('100000000000000000000') },
	{ storageprice: SiaAPI.siacoinsToHastings('313373133731337313373') },

])

describe('storage estimation', () => {
	it('storage estimation calculations are isomorphic', () => {
		const priceGBSC = estimatedStoragePriceGBSC(hosts, size, period)
		expect(allowanceStorage(SiaAPI.siacoinsToHastings(priceGBSC), hosts, period)).to.equal('10 GB')
	})
	it('filters outliers', () => {
		const unfilteredAverage = hosts.reduce((sum, host) => sum.add(host.storageprice), new BigNumber(0)).dividedBy(hosts.size)
		expect(estimatedStoragePriceH(hosts, 1, 100).lt(unfilteredAverage)).to.be.true
	})
})

import { expect } from 'chai'
import { allowanceStorage, estimatedStoragePriceGBSC } from '../../plugins/Files/js/sagas/helpers.js'
import { List } from 'immutable'
import Siad from 'sia.js'

global.SiaAPI = {
	hastingsToSiacoins: Siad.hastingsToSiacoins,
	siacoinsToHastings: Siad.siacoinsToHastings,
}

const size = 10 // 10 gb
const period = 12000

const hosts = List([
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
	{ storageprice: SiaAPI.siacoinsToHastings(2000) },
])

describe('storage estimation', () => {
	it('storage estimation calculations are isomorphic', () => {
		const priceGBSC = estimatedStoragePriceGBSC(hosts, size, period)
		expect(allowanceStorage(SiaAPI.siacoinsToHastings(priceGBSC), hosts, period)).to.equal('10 GB')
	})
})

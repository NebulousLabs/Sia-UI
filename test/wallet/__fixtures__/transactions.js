import { List } from 'immutable'
import BigNumber from 'bignumber.js'

export default List([
	{
		confirmed: true,
		transactionsums: {
			totalSiacoin: new BigNumber(10),
			totalSiafund: new BigNumber(0),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid',
		confirmationtimestamp: new Date(),
	},
	{
		confirmed: true,
		transactionsums: {
			totalSiacoin: new BigNumber(0),
			totalSiafund: new BigNumber(10),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid1',
		confirmationtimestamp: new Date(),
	},
	{
		confirmed: true,
		transactionsums: {
			totalSiacoin: new BigNumber(0),
			totalSiafund: new BigNumber(0),
			totalMiner: new BigNumber(10),
		},
		transactionid: 'testid2',
		confirmationtimestamp: new Date(),
	},
	{
		confirmed: true,
		transactionsums: {
			totalSiacoin: new BigNumber(-10),
			totalSiafund: new BigNumber(0),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid3',
		confirmationtimestamp: new Date(),
	},
	{
		confirmed: true,
		transactionsums: {
			totalSiacoin: new BigNumber(0),
			totalSiafund: new BigNumber(-10),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid4',
		confirmationtimestamp: new Date(),
	},
	{
		confirmed: true,
		transactionsums: {
			totalSiacoin: new BigNumber(0),
			totalSiafund: new BigNumber(0),
			totalMiner: new BigNumber(-10),
		},
		transactionid: 'testid5',
		confirmationtimestamp: new Date(),
	},
	{
		confirmed: false,
		transactionsums: {
			totalSiacoin: new BigNumber(1),
			totalSiafund: new BigNumber(0),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid6',
		confirmationtimestamp: new Date(),
	},
	{
		confirmed: false,
		transactionsums: {
			totalSiacoin: new BigNumber(10),
			totalSiafund: new BigNumber(-5),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid7',
		confirmationtimestamp: new Date(),
	},
	{
		confirmed: false,
		transactionsums: {
			totalSiacoin: new BigNumber(10),
			totalSiafund: new BigNumber(1),
			totalMiner: new BigNumber(1),
		},
		transactionid: 'testid8',
		confirmationtimestamp: new Date(),
	},
	{
		confirmed: false,
		transactionsums: {
			totalSiacoin: new BigNumber(0),
			totalSiafund: new BigNumber(0),
			totalMiner: new BigNumber(0),
		},
		transactionid: 'testid9',
		confirmationtimestamp: new Date(),
	},
])

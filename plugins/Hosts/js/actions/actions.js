import * as constants from '../constants/constants.js'

export const updateSetting = (setting, value) => ({
    type: constants.UPDATE_SETTING,
    setting,
    value,
})

export const toggleAcceptingContracts = () => ({
    type: constants.TOGGLE_ACCEPTING,
})

//export const getLockStatus = () => ({
//	type: constants.GET_LOCK_STATUS,
//})

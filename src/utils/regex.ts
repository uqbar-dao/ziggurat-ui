export const MOLD_REGEX = /\+\$(( {2})|\n)[a-z-]+(( {2})|\n)(( {2})|\n)+?\$:.+?==/gms
export const ACTION_CENCOL_REGEX = /\$: {2}%.*?==/gms
export const ACTION_NOUN_LIST_REGEX = /\$%(( {2}::.*?)?)$\n( +)\[%.+?\].+==/gms

export const ADDRESS_REGEX = /^0x([A-Fa-f0-9]{65})$/
export const ETH_ADDRESS_REGEX = /^0x([A-Fa-f0-9]{40})$/
export const BLOCK_SEARCH_REGEX = /[0-9]+\/[0-9]+\/[0-9]+/
export const TXN_HASH_REGEX = /^0x([A-Fa-f0-9]{64})$/
export const GRAIN_REGEX = /^0x([A-Fa-f0-9]+)$/

export const NON_HEX_REGEX = /[^xA-Fa-f0-9]/g
export const NON_NUM_REGEX = /[^0-9.]/g

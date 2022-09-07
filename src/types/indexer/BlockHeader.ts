export interface RawBlockHeader {
  'block-header': {
    'data-hash': string
    num: number
    'prev-header-hash': string
  }
  'epoch-num': number
}

export interface BlockHeader {
  blockHeader: {
    dataHash: string
    num: number
    prevHeaderHash: string
  }
  epochNum: number
}

// export const processBlockHeader = (bh: RawBlockHeader) => ({
//   blockHeader: {
//     dataHash: bh['block-header']['data-hash'],
//     num: bh['block-header']['num'],
//     prevHeaderHash: bh['block-header']['prev-header-hash'],
//   },
//   epochNum: bh['epoch-num'],
// })

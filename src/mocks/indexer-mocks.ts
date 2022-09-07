import { Block } from "../types/indexer/Block"
import { Transaction } from "../types/indexer/Transaction"

export const mockAccounts = [{"nick":"0xbeef","address":"0x3e87b0cbb431d0e8a2ee2ac42d9dacab8063d6bb62ff9b2aae1b90f569c3f3423","rawAddress":"0x3.e87b.0cbb.431d.0e8a.2ee2.ac42.d9da.cab8.063d.6bb6.2ff9.b2aa.e1b9.0f56.9c3f.3423","privateKey":"0xf3b2f5ab92dfa29d5e8efe7098cbed993856949bfb4f5cfb7bca4a450ae70e50","rawPrivateKey":"0xf3b2.f5ab.92df.a29d.5e8e.fe70.98cb.ed99.3856.949b.fb4f.5cfb.7bca.4a45.0ae7.0e50","nonces":{"0":1,"1":7},"imported":false}]

export const mockMetadata = {
  "32.770.263.103.071.854": {
    'token_type': 'token',
    'town': '0x0',
    'id': '0x61.7461.6461.7465.6d2d.7367.697a',
    'data': {
      "name":"Monkey JPEGs",
      "salt":23145,
      "deployer":"0x0",
      "attributes":"TODO...",
      "cap":0,
      "symbol":"BADART",
      "supply":1,
      "mintable":false,
      minters: [],
    }
  },
  "1.936.157.050": {
    'token_type': 'nft',
    'town': '0x0',
    'id': '0x61.7461.6461.7465.6d2d.7367.697a',
    'data': {
      "name":"Uqbar Tokens",
      "salt":56254654,
      "decimals":18,
      "deployer":"0x0",
      "cap":0,
      "symbol":"ZIG",
      "supply":1e+24,
      "mintable":false,
      minters: [],
    }
  }
}

export const mockBlockHeaders = [{"epochNum":1688,"blockHeader":{"dataHash":"0xa403.fb28.8bd4.8a10.c6e2.5d6f.530b.f40c","prevHeaderHash":"0xc25c.fcf4.e333.2c7c.2751.9cee.f172.1711","num":0}},{"epochNum":1687,"blockHeader":{"dataHash":"0xa403.fb28.8bd4.8a10.c6e2.5d6f.530b.f40c","prevHeaderHash":"0xf1d1.59ac.364a.b34d.3297.4480.e98c.f0ba","num":0}},{"epochNum":1686,"blockHeader":{"dataHash":"0xa403.fb28.8bd4.8a10.c6e2.5d6f.530b.f40c","prevHeaderHash":"0xdd6a.430f.9a52.7c7d.75a1.28a1.60c8.21ee","num":0}},{"epochNum":1685,"blockHeader":{"dataHash":"0xa403.fb28.8bd4.8a10.c6e2.5d6f.530b.f40c","prevHeaderHash":"0x4d92.eb0c.2c39.9f2a.0401.68f6.56bf.0a5f","num":0}},{"epochNum":1684,"blockHeader":{"dataHash":"0xa403.fb28.8bd4.8a10.c6e2.5d6f.530b.f40c","prevHeaderHash":"0xf8d9.fa60.3ba4.c0d2.5fde.da6c.a3c7.c4a0","num":0}}]

export const mockBlock: Block = {"chunk":{"transactions":[{"egg":{"shell":{"status":0,"budget":10000,"from":{"id":"0x3.e87b.0cbb.431d.0e8a.2ee2.ac42.d9da.cab8.063d.6bb6.2ff9.b2aa.e1b9.0f56.9c3f.3423","nonce":1,"zigs":1.10558721324506e+38},"to":"0x6c.6f74.6970.6163","ethHash":null,"rate":1,"townId":0,"sig":{"life":3.325002395720032e+76,"ship":"~darmer-noswex-holmul-disbec--nibmel-picbyn-wislus-dolnev--natbud-fidfen-falmex-davwer--wacsyx-bonryp-pinnem-sicsyp","hash":"0x1"}},"yolk":{"args":null,"myGrains":[],"caller":{"id":"0x3.e87b.0cbb.431d.0e8a.2ee2.ac42.d9da.cab8.063d.6bb6.2ff9.b2aa.e1b9.0f56.9c3f.3423","nonce":1,"zigs":1.10558721324506e+38},"contGrains":["0x64.6c72.6f77"]}},"hash":"0x241a.8cb8.4029.928f.af49.a5c0.1c9a.03f4.3538.8295.12d4.b2e3.83e3.fd1d.7b25.dd2b"}],"town":{"granary":{"0x64.6c72.6f77":{"salt":431316168567,"data":0,"isRice":true,"lord":"0x6c.6f74.6970.6163","id":"0x64.6c72.6f77","holder":"0x6c.6f74.6970.6163","townId":0},"0x532c.d5cf.befc.5c0f.86e1.40bb.6e89.c2d8":{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x532c.d5cf.befc.5c0f.86e1.40bb.6e89.c2d8","holder":"0x3.e87b.0cbb.431d.0e8a.2ee2.ac42.d9da.cab8.063d.6bb6.2ff9.b2aa.e1b9.0f56.9c3f.3423","townId":0},"0x532c.d5cf.befc.5c0f.0d88.3e91.f6da.0181":{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x532c.d5cf.befc.5c0f.0d88.3e91.f6da.0181","holder":"0x2.eaea.cffd.2bbe.e0c0.02dd.b5f8.dd04.e63f.297f.14cf.d809.b616.2137.126c.da9e.8d3d","townId":0},"0x61.7461.6461.7465.6d2d.7367.697a":{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x61.7461.6461.7465.6d2d.7367.697a","holder":"0x74.6361.7274.6e6f.632d.7367.697a","townId":0},"0x532c.d5cf.befc.5c0f.466a.f0de.876f.706b":{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x532c.d5cf.befc.5c0f.466a.f0de.876f.706b","holder":"0x2.4a1c.4643.b429.dc12.6f3b.03f3.f519.aebb.5439.08d3.e0bf.8fc3.cb52.b92c.9802.636e","townId":0},"0x74.6361.7274.6e6f.632d.7367.697a":{"cont":null,"owns":["0x532c.d5cf.befc.5c0f.86e1.40bb.6e89.c2d8","0x532c.d5cf.befc.5c0f.466a.f0de.876f.706b","0x532c.d5cf.befc.5c0f.0d88.3e91.f6da.0181","0x61.7461.6461.7465.6d2d.7367.697a"],"isRice":false,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x74.6361.7274.6e6f.632d.7367.697a","holder":"0x74.6361.7274.6e6f.632d.7367.697a","townId":0},"0x7461.7275.6767.697a":{"salt":8386109829712144000,"data":0,"isRice":true,"lord":"0x6c.6f74.6970.6163","id":"0x7461.7275.6767.697a","holder":"0x6c.6f74.6970.6163","townId":0},"0x6c.6f74.6970.6163":{"cont":null,"owns":[],"isRice":false,"lord":"0x6c.6f74.6970.6163","id":"0x6c.6f74.6970.6163","holder":"0x6c.6f74.6970.6163","townId":0}},"populace":{"0x3.e87b.0cbb.431d.0e8a.2ee2.ac42.d9da.cab8.063d.6bb6.2ff9.b2aa.e1b9.0f56.9c3f.3423":1,"0x2.4a1c.4643.b429.dc12.6f3b.03f3.f519.aebb.5439.08d3.e0bf.8fc3.cb52.b92c.9802.636e":0,"0x2.eaea.cffd.2bbe.e0c0.02dd.b5f8.dd04.e63f.297f.14cf.d809.b616.2137.126c.da9e.8d3d":0}}},"location":{"epochNum":1,"blockNum":0,"townId":0}}

export const mockTransaction: Transaction = {"timestamp": 1654863405678, "location":{"epochNum":1,"eggNum":0,"blockNum":0,"townId":0},"egg":{"shell":{"status":0,"budget":10000,"from":{"id":"0x3.e87b.0cbb.431d.0e8a.2ee2.ac42.d9da.cab8.063d.6bb6.2ff9.b2aa.e1b9.0f56.9c3f.3423","nonce":1,"zigs":1.10558721324506e+38},"to":"0x6c.6f74.6970.6163","ethHash":null,"rate":1,"townId":0,"sig":{"life":3.325002395720032e+76,"ship":"~darmer-noswex-holmul-disbec--nibmel-picbyn-wislus-dolnev--natbud-fidfen-falmex-davwer--wacsyx-bonryp-pinnem-sicsyp","hash":"0x1"}},"yolk":{"args":null,"myGrains":[],"caller":{"id":"0x3.e87b.0cbb.431d.0e8a.2ee2.ac42.d9da.cab8.063d.6bb6.2ff9.b2aa.e1b9.0f56.9c3f.3423","nonce":1,"zigs":1.10558721324506e+38},"contGrains":["0x64.6c72.6f77"]}}}

export const mockTransactions = [mockTransaction, mockTransaction, mockTransaction, mockTransaction, mockTransaction, mockTransaction, mockTransaction, mockTransaction, mockTransaction, mockTransaction]

export const mockHolderGrains = [{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x532c.d5cf.befc.5c0f.86e1.40bb.6e89.c2d8","holder":"0x3.e87b.0cbb.431d.0e8a.2ee2.ac42.d9da.cab8.063d.6bb6.2ff9.b2aa.e1b9.0f56.9c3f.3423","townId":0},{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x532c.d5cf.befc.5c0f.0d88.3e91.f6da.0181","holder":"0x2.eaea.cffd.2bbe.e0c0.02dd.b5f8.dd04.e63f.297f.14cf.d809.b616.2137.126c.da9e.8d3d","townId":0},{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x61.7461.6461.7465.6d2d.7367.697a","holder":"0x74.6361.7274.6e6f.632d.7367.697a","townId":0},{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x532c.d5cf.befc.5c0f.466a.f0de.876f.706b","holder":"0x2.4a1c.4643.b429.dc12.6f3b.03f3.f519.aebb.5439.08d3.e0bf.8fc3.cb52.b92c.9802.636e","townId":0},{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0xcb22.90ff.6e2f.ba63.466a.f0de.876f.706b","holder":"0x2.4a1c.4643.b429.dc12.6f3b.03f3.f519.aebb.5439.08d3.e0bf.8fc3.cb52.b92c.9802.636e","townId":1},{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0xcb22.90ff.6e2f.ba63.86e1.40bb.6e89.c2d8","holder":"0x3.e87b.0cbb.431d.0e8a.2ee2.ac42.d9da.cab8.063d.6bb6.2ff9.b2aa.e1b9.0f56.9c3f.3423","townId":1},{"cont":null,"owns":["0x532c.d5cf.befc.5c0f.86e1.40bb.6e89.c2d8","0x532c.d5cf.befc.5c0f.466a.f0de.876f.706b","0x532c.d5cf.befc.5c0f.0d88.3e91.f6da.0181","0x61.7461.6461.7465.6d2d.7367.697a"],"isRice":false,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x74.6361.7274.6e6f.632d.7367.697a","holder":"0x74.6361.7274.6e6f.632d.7367.697a","townId":0},{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0xcb22.90ff.6e2f.ba63.0d88.3e91.f6da.0181","holder":"0x2.eaea.cffd.2bbe.e0c0.02dd.b5f8.dd04.e63f.297f.14cf.d809.b616.2137.126c.da9e.8d3d","townId":1}]

export const mockLordGrains = [{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x532c.d5cf.befc.5c0f.86e1.40bb.6e89.c2d8","holder":"0x3.e87b.0cbb.431d.0e8a.2ee2.ac42.d9da.cab8.063d.6bb6.2ff9.b2aa.e1b9.0f56.9c3f.3423","townId":0},{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x532c.d5cf.befc.5c0f.0d88.3e91.f6da.0181","holder":"0x2.eaea.cffd.2bbe.e0c0.02dd.b5f8.dd04.e63f.297f.14cf.d809.b616.2137.126c.da9e.8d3d","townId":0},{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x61.7461.6461.7465.6d2d.7367.697a","holder":"0x74.6361.7274.6e6f.632d.7367.697a","townId":0},{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x532c.d5cf.befc.5c0f.466a.f0de.876f.706b","holder":"0x2.4a1c.4643.b429.dc12.6f3b.03f3.f519.aebb.5439.08d3.e0bf.8fc3.cb52.b92c.9802.636e","townId":0},{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0xcb22.90ff.6e2f.ba63.466a.f0de.876f.706b","holder":"0x2.4a1c.4643.b429.dc12.6f3b.03f3.f519.aebb.5439.08d3.e0bf.8fc3.cb52.b92c.9802.636e","townId":1},{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0xcb22.90ff.6e2f.ba63.86e1.40bb.6e89.c2d8","holder":"0x3.e87b.0cbb.431d.0e8a.2ee2.ac42.d9da.cab8.063d.6bb6.2ff9.b2aa.e1b9.0f56.9c3f.3423","townId":1},{"cont":null,"owns":["0x532c.d5cf.befc.5c0f.86e1.40bb.6e89.c2d8","0x532c.d5cf.befc.5c0f.466a.f0de.876f.706b","0x532c.d5cf.befc.5c0f.0d88.3e91.f6da.0181","0x61.7461.6461.7465.6d2d.7367.697a"],"isRice":false,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0x74.6361.7274.6e6f.632d.7367.697a","holder":"0x74.6361.7274.6e6f.632d.7367.697a","townId":0},{"salt":1936157050,"data":0,"isRice":true,"lord":"0x74.6361.7274.6e6f.632d.7367.697a","id":"0xcb22.90ff.6e2f.ba63.0d88.3e91.f6da.0181","holder":"0x2.eaea.cffd.2bbe.e0c0.02dd.b5f8.dd04.e63f.297f.14cf.d809.b616.2137.126c.da9e.8d3d","townId":1}]

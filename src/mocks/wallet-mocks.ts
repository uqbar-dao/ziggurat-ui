export const mockAccounts = [{"nick":"0xbeef","address":"0x3e87b0cbb431d0e8a2ee2ac42d9dacab8063d6bb62ff9b2aae1b90f569c3f3423","rawAddress":"0x3.e87b.0cbb.431d.0e8a.2ee2.ac42.d9da.cab8.063d.6bb6.2ff9.b2aa.e1b9.0f56.9c3f.3423","privateKey":"0xf3b2f5ab92dfa29d5e8efe7098cbed993856949bfb4f5cfb7bca4a450ae70e50","rawPrivateKey":"0xf3b2.f5ab.92df.a29d.5e8e.fe70.98cb.ed99.3856.949b.fb4f.5cfb.7bca.4a45.0ae7.0e50","nonces":{"0":1,"1":7},"imported":false}]

export const mockMetadata = {
  '0x61.7461.6461.7465.6d2d.7367.697a': {
    'token_type': 'token',
    'town': '0x0',
    'id': '0x61.7461.6461.7465.6d2d.7367.697a',
    'data': {
      'name': 'UQ| Tokens',
      'symbol': 'ZIG',
      'salt': 1936157050,
      'decimals': 18,
      'supply': 100000000000000,
      'cap': null,
      'mintable': true,
      'minters': ['0xdead', '0xbeef'],
      'deployer': '0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04',
    }
  }
}

export const mockTransactions = [
  {
    'hash': '0xb3cb.cbe3.65b0.f6e1.588d.fe02.11df.ef88',
    'args': {
      'give': {
        'grain': '0x89a0.89d8.dddf.d13a.418c.0d93.d4b4.e7c7.637a.d56c.96c0.7f91.3a14.8174.c7a7.71e6',
        'to': '0xd6dc.c8ff.7ec5.4416.6d4e.b701.d1a6.8e97.b464.76de'
      }
    },
    'town': '0x0',
    'nonce': 6,
    'rate': 1,
    'budget': 1000000,
    'to': '0x74.6361.7274.6e6f.632d.7367.697a',
    'from': '0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70',
    'status': 0
  }
]

export const mockAssets = {
  "0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70": {
      "0x89a0.89d8.dddf.d13a.418c.0d93.d4b4.e7c7.637a.d56c.96c0.7f91.3a14.8174.c7a7.71e6": {
          "contract": "0x61.7461.6461.7465.6d2d.7367.697a",
          "data": {
              "balance": 300000000000000000000,
              "metadata": "0x74.6361.7274.6e6f.632d.7367.697a"
          },
          "id": "0x89a0.89d8.dddf.d13a.418c.0d93.d4b4.e7c7.637a.d56c.96c0.7f91.3a14.8174.c7a7.71e6",
          "town": "0x0",
          "token_type": "token",
          "holder": "0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70",
      },
      "0x7e21.2812.bfae.4d2e.6b3d.9941.b776.3c0f.33bc.fb6d.c759.2d80.be02.a7b2.48a8.da97": {
          "contract": "0x6174.6164.6174.656d.2d74.666e",
          "data": {
              "metadata": "0xcafe.babe",
              "transferrable": true,
              "uri": "ipfs://QmUbFVTm113tJEuJ4hZY2Hush4Urzx7PBVmQGjv1dXdSV9",
              "id": 1,
              "allowances": [],
              "properties": {
                  "mouth": "smile",
                  "eyes": "big",
                  "hat": "pyramid"
              }
          },
          "id": "0x7e21.2812.bfae.4d2e.6b3d.9941.b776.3c0f.33bc.fb6d.c759.2d80.be02.a7b2.48a8.da97",
          "town": "0x0",
          "token_type": "nft",
          "holder": "0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70",
      }
  }
}

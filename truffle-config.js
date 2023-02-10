require('dotenv').config();
const HDWalletProvider = require("truffle-hdwallet-provider-klaytn")

const NETWORK_ID = '1001'
const URL = 'https://api.baobab.klaytn.net:8651'
const GASLIMIT = '8500000'

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  networks: {
    baobab: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
    },

    // unlocked account 방법
    // baobab: {
    //   host: HOST,
    //   port: PORT,
    //   network_id: NETWORK_ID,
    //   from: FROM,
    //   gas: GASLIMIT,
    //   gasPrice: null,
    // },

  },
  // 컴파일러 버전
  compilers: {
    solc: {
      version: '0.5.6',
    },
  },
}

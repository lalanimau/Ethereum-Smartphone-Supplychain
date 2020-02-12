const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = "write define struggle ball leg blur enemy distance truly double embrace promote";

module.exports = {
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  },
  networks: {
    development: {
      host: "3.19.62.104",
      port: 8545,
      network_id: "*",
      // gasPrice: 100000000000,
      // gas: 9999999 // gas limit
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/8ea6f9a7f9ba4612afe9410f22222d7b");
      },
      network_id: 3
      // gas: 4500000,
      // gasPrice: 10000000000,
    }
  }
};
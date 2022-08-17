require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: "https://rpc01-sg.dogechain.dog",
        gasMultiplier: 2
      },
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    },
    fantom: {
      url: "https://0xdao.globe.ftm.node.web3rpc.com/",
      gasMultiplier: 2,
      accounts: [
        "",
      ],
    },
    ftmTest: {
      url: "https://rpc.testnet.fantom.network/",
      gasMultiplier: 2,
      accounts: [
        "",
      ],
    },
    local:{
        url: "http://127.0.0.1:8545",
        gasMultiplier: 2,
        accounts: [
          "",
        ],
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  etherscan: {
    apiKey: "",
  },
};

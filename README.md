## Introduction
> This project contains the functionality to manage smartphone supplychian management.
The UML diagrams are in the UML_Diagrams folder which will help you understand on how it works.


## Prerequisites
1. You need to have `ganache-cli` installed globally on your system and it should be running
at `HOST`:`127.0.0.1`(localhost) `PORT`:`8545`, this is the default settings.
2. You need to have `yarn` or `npm` to install all the dependencies from `package.json`
3. Then you can install the dependencies by running the following from your terminal
> `yarn install` or `npm install`

## Program Version numbers

`node`: v8.11.2

`Ganache CLI` v6.1.8 (ganache-core: 2.2.1)

`solidity`/`solc-js`:  ^0.4.20

`truffle`: ^4.1.13

`web3`: ^0.20.7


## How to run tests
To run the provided tests, run the following command
> `yarn test`

## If you want to test the Front-end connected to rinkeby then everything is already setup just run the following command
> `yarn dev`

For testing on local network see below.

## How to deploy the smart contract to local network and start the front-end DAPP.
To deploy the smart contract and start the front-end, run the following command.
> `yarn deploy`

By doing so, you will have deployed the smart contract to local development network and you can
start using the front-end app using browisng to `http://localhost:8080/`

## How to deploy to Rinkeby test network.
To deploy the smart contract to rinkeby test network, run the following command,
> `yarn rinkeby`

## Deployed smart contract details on Rinkeby test network

> Contract Address: ```0xef1e425166875e1ea2dc0635bfd2fe1ef19f4d6f```

> TxHash: ```0x81d29028f66c7163a3d668e9335bd8a6063569a0f59964a4b9f56049f27b34c0```

> addManufacturer(): ```0x5b59195dab81a63a3d4cdf6c640cd403e6bf156febe421f5d4582430ec848628```

> manufactureComponents(): ```0x78989d1d9e60ea4ef0243432ad436b2feb0c07a1c56598adffd2c9d0419618e3```

> addSmartphoneMaker(): ```0x258351cd98e330d17c5ca141e0d9ec959a1a50f94ad1924455782b831cd334ed```

> assembleSmartphone(): ```0x98ea26d28fd5169b50bffb3da7fa99593ca72f17eb70c9d06b295d9ecd96d500```

> addRetailer(): ```0x5f06419626718036907f85c2ce49e7a8cb28b0cd01be85a838b0641708163dcd```

> retailerBuy(): ```0xfccae3f522a1b4527f14c9bafbc88aa3592647f218d4bd7a3c42cdeac7b6b4ed``` (payable)

> retailerMarkAsReceived(): ```0x9de26392364b45e6522bfe6de7f43bcfe5477540b73476c8f0b2e7c68fd9d0ae```

> putForSale():  ```0x14860fd4b1596c4503e94c95ab1c9310bdde07e97655f76c3e684dad50c7da81```

> consumerBuy(): ```0x5f60d1821a63339a28dcb8635e079a8e2ca4526ae4ea8a4bf74a8ad6de044df3``` (payable)

## Example of how to use the front-end
I have provided a few screenshots on how to use the front-end in the `screenshots` folders.

## Note: I highly suggest you to use the provided npm commands as described above to avoid compatibility issues with `truffle` and `web3`
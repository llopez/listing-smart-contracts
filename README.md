# Listing Smart Contracts

These are the Listing smart contracts

## Tech Stack

* Hardhat
* Solidity
* TypeScript

## Getting Started

### First, add environment variables:

The application makes use of 4 environment variables
* RPC_URL
* DEPLOYER_PRIVATE_KEY
* ETHERSCAN_API_KEY
* PROXY

```bash
touch .env
```

### Then, install the dependencies

```bash
yarn install
```

### Finally, run the tests and deploy

```bash
yarn run hardhat test
yarn run hardhat run scripts/3_deploy.ts
```

## Links

To learn more about the project, take a look at the following resources:

- https://goerli.etherscan.io/address/0xA3d8CD32d1C45f452682421B7d89bD523Af347b6 - smart contract on explorer


const zksync = require('zksync-web3');
const utils = require('./utils.js');

// RPC
const constants = require('./constants.js');
const provider = new zksync.Provider(constants.RPCUrl);

// Signer
const secrets = require('./secrets.json');
const signer = new zksync.Wallet(secrets.privateKey).connect(provider);

// Contract
const contracts = require('./contracts.js');
const faucetABI = require('./abi/testnet_faucet.json');
const faucetContract = new zksync.Contract(contracts.testnetFaucet, faucetABI, signer);

async function addTestnetFaucetOperator(operator) {
    console.log('Use faucet contract:', contracts.testnetFaucet);

    if (!operator) {
        throw Error('Invalid operator address');
    }
    console.log(`Adding ${operator} as faucet operator..`);
    
    const handle = await faucetContract.setOperator(operator, true);
    await utils.waitConfirm(handle);

    if (await faucetContract.isOperator(operator)) {
        console.log(`Operator has been added successfully.`);
    } else {
        console.error('Failed. It seems the transaction has been reverted.');
    }
}

async function execute() {
    console.log('Use account: ', signer.address);
    console.log('Use fee token:', constants.feeToken);
    console.log('Current block:', await provider.getBlockNumber());

    const args = (process.argv).slice(2);
    await addTestnetFaucetOperator(args[0]);
}

// execute tasks
execute().then(() => {
    console.log('All tasks have been executed.');
});
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

async function addDrip(token, amount) {
    console.log('Use faucet contract:', contracts.testnetFaucet);

    if (!token) {
        throw Error('Invalid token address');
    }
    if (!amount) {
        throw Error('Invalid amount');
    }
    console.log(`Add drip for test token ${token} (amount ${amount})..`);
    
    const handle = await faucetContract.addDrip(token, amount);
    await utils.waitConfirm(handle);
}

async function execute() {
    console.log('Use account: ', signer.address);
    console.log('Use fee token:', constants.feeToken);
    console.log('Current block:', await provider.getBlockNumber());

    const args = (process.argv).slice(2);
    await addDrip(args[0], args[1]);
}

// execute tasks
execute().then(() => {
    console.log('All tasks have been executed.');
});
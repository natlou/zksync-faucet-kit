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

async function checkOperatorPermission(account) {
    console.log('Use faucet contract:', contracts.testnetFaucet);

    if (!account) {
        throw Error('Invalid operator address');
    }
    console.log(`Checks operator permission for ${account}..`);
    
    if (await faucetContract.isOperator(account)) {
        console.log(`Success. ${account} is an operator.`);
    } else {
        console.error(`Failed. ${account} is not an operator.`);
    }
}

async function execute() {
    console.log('Use account: ', signer.address);
    console.log('Use fee token:', constants.feeToken);
    console.log('Current block:', await provider.getBlockNumber());

    const args = (process.argv).slice(2);
    await checkOperatorPermission(args[0]);
}

// execute tasks
execute().then(() => {
    console.log('All tasks have been executed.');
});
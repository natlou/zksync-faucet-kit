const zksync = require('zksync-web3');

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

async function claimTokens() {
    
    console.log(`Sending tokens to ${signer.address}`);

    const claimed = await faucetContract.claimAll();

    if (claimed) {
        console.log(`Tokens claimed successfully.`);
    } else {
        console.error('Failed. It seems the transaction has been reverted.');
    }
}


async function execute() {
    console.log('Use account: ', signer.address);
    console.log('Use fee token:', constants.feeToken);
    console.log('Current block:', await provider.getBlockNumber());

    await claimTokens();
}

// execute tasks
execute().then(() => {
    console.log('All tasks have been executed.');
});
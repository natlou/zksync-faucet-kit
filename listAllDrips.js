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
const ERC20ABI = require('./abi/erc20.json');
const { ethers, BigNumber } = require('ethers');
const faucetContract = new zksync.Contract(contracts.testnetFaucet, faucetABI, signer);

async function listAllDrips() {
    console.log('Use faucet contract:', contracts.testnetFaucet);
    console.log(`Listing all faucet drips..`);
    
    const dripsLength = await faucetContract.dripsLength();
    console.log('Drips length (amount) is', dripsLength.toString());

    const drips = await faucetContract.allDrips();
    if (drips.length === 0) {
        console.log('No drips found.');
    } else {
        for (let i = 0; i < drips.length; i++) {
            const drip = drips[i];
            
            const token = new zksync.Contract(drip.token, ERC20ABI, signer);
            const decimals = await token.decimals();
            const symbol = await token.symbol();

            console.log(`
                * Drip ${i}
                 - active: ${drip.active},
                 - token: ${drip.token},
                 - decimals: ${decimals},
                 - name: ${await token.name()},
                 - symbol: ${symbol},
                 - totalSupply: ${format(await token.totalSupply(), decimals)} ${symbol},
                 - amount: ${format(drip.amount, decimals)} ${symbol} (${drip.amount.toString()})
            `);
        }
    }
}

function format(number, decimals) {
    return ethers.utils.formatUnits(number, decimals);
}

async function execute() {
    console.log('Use account: ', signer.address);
    console.log('Use fee token:', constants.feeToken);
    console.log('Current block:', await provider.getBlockNumber());

    await listAllDrips();
}

// execute tasks
execute().then(() => {
    console.log('All tasks have been executed.');
});
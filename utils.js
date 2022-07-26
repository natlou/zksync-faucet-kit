const { BigNumber } = require("ethers");

async function waitConfirm(handle) {
    console.log('> Transaction submitted:', handle.hash);
    console.log('> Wait for confirm..');
    const receipt = await handle.wait();
    console.log('> Transaction confirmed, status:', receipt.status === 1 ? '✔ Success' : 'X Reverted');
}

function now() {
    return BigNumber.from(Math.floor(Date.now() / 1000));
}

exports.waitConfirm = waitConfirm;
exports.now = now;
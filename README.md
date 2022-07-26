# Testnet Faucet Kit

Set of scripts to help operate the testnet faucet.

## Install

`yarn`

## Scripts

```
- Adds an operator (Requires owner permission).
node addTestnetFaucetOperator ${operatorAddress}

- Checks operator permission for an account.
node checkOperatorPermission ${operatorAddress}

- Lists all drips.
node listAllDrips

- Mint test tokens (Requires operator permission).
node mintTestTokens ${tokenAddress} ${amountInUnits}

- Adds a drip (Requires operator permission).
node addDrip ${tokenAddress} ${amountInUnits}

- Set active status for a drip (Requires operator permission).
node setDripActive ${dripId} ${status}
```
import {SwapEvent, TokenBalances} from "./types";
import BigNumber from 'bignumber.js';

export function parseSwapEvents(swapEvents: SwapEvent[]): Record<string, TokenBalances> {
    const balances: Record<string, TokenBalances> = {};
    swapEvents.forEach(event => {
        if (!balances[event.sender]) {
            balances[event.sender] = { WETH: BigNumber(0), USDC: BigNumber(0) };
        }
        if (!balances[event.recipient]) {
            balances[event.recipient] = { WETH: BigNumber(0), USDC: BigNumber(0) };
        }

        if (BigNumber(event.amount_from).isNegative()){
            // recipient is receiving USDC
            balances[event.recipient].USDC = BigNumber(balances[event.recipient].USDC).plus(BigNumber(event.amount_from).abs())
            balances[event.sender].WETH = BigNumber(balances[event.sender].WETH).minus(BigNumber(event.amount_to).abs());
        } else {
            // recipient is receiving WETH
            balances[event.recipient].WETH = BigNumber(balances[event.recipient].WETH).plus(BigNumber(event.amount_to).abs())
            balances[event.sender].USDC = BigNumber(balances[event.sender].USDC).minus(BigNumber(event.amount_from).abs())
        }
    });

    return balances
}



export function writeBalancesToConsole(balances: Record<string, TokenBalances>) {
    // USDC has 6 decimals
    // ETH has 18 decimals
    for (const [key, value] of Object.entries(balances)) {
        console.log(key, 'WETH:', value.WETH.div(BigNumber(10).pow(18)).toString(), 'USDC:',value.USDC.div(BigNumber(10).pow(6)).toString());
    }
}

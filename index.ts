require("dotenv").config();

import { ethers } from "ethers";
import { abi } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';

import { SwapEvent } from "./lib/types";
import { parseSwapEvents, writeBalancesToConsole} from './lib/helper';

const { RPC_PROVIDER, UNISWAP_V3_POOL_ADDRESS } = process.env;


let eventCount = 0;
const maxEvents = 1;

const provider = new ethers.JsonRpcProvider(RPC_PROVIDER);
// Connect to the UniswapV3Pool contract
const contract = new ethers.Contract(UNISWAP_V3_POOL_ADDRESS, abi, provider);
const swapEvents: SwapEvent[] = []

const eventListener = (sender, recipient, amount0, amount1) => {
    /**
     * amount0: how many of token0 the pool received during this swap
     * amount1: how many of token1 the pool received during this swap
     */
    console.log(`Swap Event Detected:
            Sender: ${sender}
            Recipient: ${recipient}
            Amount0: ${amount0.toString()}
            Amount1: ${amount1.toString()}
        `);

    swapEvents.push({
        sender: sender,
        recipient: recipient,
        amount_from: amount0,
        amount_to: amount1,
    })

    eventCount++;
    if (eventCount >= maxEvents) {
        const parsedBalances = parseSwapEvents(swapEvents);
        // write balances to console once finished
        writeBalancesToConsole(parsedBalances)

        contract.off("Swap", eventListener);
        console.log("Stopped listening events");
    }
};

function listenForSwapEvents() {
    // Listen for Swap events
    contract.on("Swap", eventListener);

    console.log("Listening for Swap events...");
}
listenForSwapEvents()

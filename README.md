# Swap Event Tracker

This application tracks and processes swap events, specifically mapping net token amounts (WETH & USDC) swapped across all captured events by each unique wallet address.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) package manager

## Setup

1. **Clone the Repository**
    - Clone this repository to your local machine.

2. **Install Dependencies**
    - Run `yarn install` to install the required dependencies.

3. **Environment Variables**
    - Copy `.env.example` to a new file named `.env`.
    - Modify the `.env` file to include your specific environment variables (like Ethereum node URLs, API keys, etc.).

## Running the Script

- Execute the script using the command `parse`.
- The script will process the swap events and output the results.

## Additional Information

- This script is designed to work with Ethereum-based swap events, particularly for tracking WETH and USDC transactions.
- Ensure your Ethereum node or provider service is accessible and properly configured in the `.env` file.

## Types

The script uses the following TypeScript interfaces:

```typescript
import BigNumber from 'big-number';

export interface SwapEvent {
    sender: string;
    recipient: string;
    amount_from: string;
    amount_to: string;
}

export interface TokenBalances {
    WETH: BigNumber;
    USDC: BigNumber;
}
```
## Helper functions

The script uses the following helper functions inside /lib folder:

```typescript
import { SwapEvent, TokenBalances } from "./types";
import BigNumber from 'bignumber.js';

function parseSwapEvents(swapEvents: SwapEvent[]): Record<string, TokenBalances> {
    // implementation in /lib/helper.ts
}

function writeBalancesToConsole(balances: Record<string, TokenBalances>) {
    // implementation in /lib/helper.ts
}
```

## Main Script

The script is run from terminal

```typescript
require("dotenv").config();

import { ethers } from "ethers";
import { abi } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';

import { SwapEvent } from "./lib/types";
import { parseSwapEvents, writeBalancesToConsole} from './lib/helper';

const { RPC_PROVIDER, UNISWAP_V3_POOL_ADDRESS } = process.env;


let eventCount = 0;
const maxEvents = 2;

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
```

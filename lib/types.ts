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

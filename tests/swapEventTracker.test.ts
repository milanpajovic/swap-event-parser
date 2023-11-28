import { parseSwapEvents } from '../lib/helper';
import { SwapEvent } from '../lib/types'

describe('Swap Event Tracker Tests', () => {
    test('parseSwapEvents should correctly calculate balances', () => {
        const testEvents: SwapEvent[] = [
            { sender: '0xSender1', recipient: '0xRecipient1', amount_from: '-100', amount_to: '50' },
            { sender: '0xSender2', recipient: '0xRecipient2', amount_from: '200', amount_to: '-100' }
        ];

        const balances = parseSwapEvents(testEvents);
        // Check if the balances for each address are correct
        expect(balances['0xSender1'].WETH.toString()).toBe('-50');
        expect(balances['0xSender1'].USDC.toString()).toBe('0');
        expect(balances['0xRecipient1'].WETH.toString()).toBe('0');
        expect(balances['0xRecipient1'].USDC.toString()).toBe('100');

        expect(balances['0xSender2'].WETH.toString()).toBe('0');
        expect(balances['0xSender2'].USDC.toString()).toBe('-200');
        expect(balances['0xRecipient2'].WETH.toString()).toBe('100');
        expect(balances['0xRecipient2'].USDC.toString()).toBe('0');
    });
});

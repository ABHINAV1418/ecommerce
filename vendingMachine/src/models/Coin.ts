export enum CoinType {
    PENNY = 1,    // 1 cent
    NICKEL = 5,   // 5 cents
    DIME = 10,    // 10 cents
    QUARTER = 25  // 25 cents
}

export class Coin {
    type: CoinType;
    value: number;
    
    constructor(type: CoinType) {
        this.type = type;
        this.value = type;
    }
    
    /**
     * Get the name of the coin
     */
    getName(): string {
        switch (this.type) {
            case CoinType.PENNY:
                return 'Penny';
            case CoinType.NICKEL:
                return 'Nickel';
            case CoinType.DIME:
                return 'Dime';
            case CoinType.QUARTER:
                return 'Quarter';
            default:
                return 'Unknown';
        }
    }
    
    /**
     * Get the value of the coin in cents
     */
    getValue(): number {
        return this.value;
    }
} 
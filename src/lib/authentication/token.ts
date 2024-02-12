class Token<TPayload> {
    private payload: TPayload;
    public exp: number;

    /**
     * @param payload token payload
     * @param exp     token expiry
     */
    constructor(payload: TPayload, exp: number) {
        this.payload = payload;
        this.exp = exp;
    }

    setPayload(payload: TPayload): void {
        this.payload = payload;
    }

    getPayload(): TPayload {
        return this.payload;
    }

    setExp(exp: number): void {
        this.exp = exp;
    }

    getExp(): number {
        return this.exp;
    }
}

export default Token;
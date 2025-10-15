import { describe, it, expect } from '@jest/globals';
import { OptimizationEngine } from '../src/math/OptimizationEngine.js';

describe('OptimizationEngine', () => {

    const sampleDebts = [
        { name: 'Student Loan', balance: 20000, rate: 0.05, minPayment: 200 },
        { name: 'Credit Card', balance: 5000, rate: 0.18, minPayment: 100 },
        { name: 'Car Loan', balance: 10000, rate: 0.04, minPayment: 300 },
    ];
    const availablePayment = 1000;

    describe('Debt Repayment', () => {
        it('should correctly calculate debt snowball', () => {
            const result = OptimizationEngine.debtSnowball(sampleDebts, availablePayment);
            expect(result.months).toBe(39);
            expect(result.totalInterest).toBeCloseTo(3168.62);
        });

        it('should correctly calculate debt avalanche', () => {
            const result = OptimizationEngine.debtAvalanche(sampleDebts, availablePayment);
            expect(result.months).toBe(39);
            expect(result.totalInterest).toBeCloseTo(3119.03);
        });
    });
});

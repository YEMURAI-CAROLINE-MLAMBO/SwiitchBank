export default class FeeService {
  static calculateBridgeFees(amount, bridgeType, userTier = 'standard') {
    const baseFees = {
      fiat_to_crypto: 0.01, // 1%
      crypto_to_fiat: 0.015, // 1.5%
      crypto_swap: 0.003, // 0.3%
    };

    const tierDiscounts = {
      standard: 1.0,
      premium: 0.7, // 30% discount
      enterprise: 0.5 // 50% discount
    };

    const baseFee = amount * baseFees[bridgeType];
    const discountedFee = baseFee * tierDiscounts[userTier];

    return {
      feeAmount: discountedFee,
      feePercentage: baseFees[bridgeType] * tierDiscounts[userTier],
      breakdown: {
        baseFee,
        tierDiscount: baseFee - discountedFee,
        finalFee: discountedFee
      }
    };
  }
}

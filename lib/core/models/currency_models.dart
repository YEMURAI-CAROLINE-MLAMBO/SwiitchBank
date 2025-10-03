class CurrencyRates {
  final Map<String, double> rates;

  CurrencyRates({required this.rates});

  factory CurrencyRates.fromJson(Map<String, dynamic> json) {
    return CurrencyRates(
      rates: Map<String, double>.from(json['rates']),
    );
  }
}

class CurrencyRecommendation {
  final String recommendedCurrency;
  final double estimatedSavings;
  final String reason;

  CurrencyRecommendation({
    required this.recommendedCurrency,
    required this.estimatedSavings,
    required this.reason,
  });

  factory CurrencyRecommendation.fromJson(Map<String, dynamic> json) {
    return CurrencyRecommendation(
      recommendedCurrency: json['recommended_currency'],
      estimatedSavings: json['estimated_savings'].toDouble(),
      reason: json['reason'],
    );
  }
}

class FinancialAnalysis {
  // Placeholder for financial analysis data
  FinancialAnalysis.fromJson(Map<String, dynamic> json);
}
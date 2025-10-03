import 'package:swiitch/core/api/api_client.dart';
import 'package:swiitch/core/models/currency_models.dart';

class JoolsFinancialService {
  final ApiClient _apiClient;

  JoolsFinancialService({ApiClient? apiClient}) : _apiClient = apiClient ?? ApiClient();

  Future<FinancialAnalysis> analyzeSpending() async {
    final response = await _apiClient.post('/jools/analyze-spending', {});
    return FinancialAnalysis.fromJson(response.data);
  }

  Future<CurrencyRecommendation> recommendCurrency(
    String baseCurrency,
    double amount,
    String targetCountry,
  ) async {
    final response = await _apiClient.post('/jools/currency-recommendation', {
      'base_currency': baseCurrency,
      'amount': amount,
      'target_country': targetCountry,
    });

    return CurrencyRecommendation.fromJson(response.data);
  }

  static void onRatesUpdated(CurrencyRates rates) {
    // Placeholder for logic to handle rate updates,
    // e.g., trigger a re-evaluation of financial advice.
    print('Jools received rate updates: ${rates.rates}');
  }
}
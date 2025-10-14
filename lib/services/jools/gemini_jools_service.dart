// lib/services/jools/gemini_jools_service.dart

import 'dart:math';
import '../../core/models/webhook_payloads.dart';

// --- Data Models for AI Analysis ---

class AIAnalysis {
  final double riskScore;
  final String summary;
  final List<String> recommendations;

  AIAnalysis({this.riskScore, this.summary, this.recommendations});
}

class PaymentInsight {
  final String spendingCategory;
  final bool isRecurring;
  final String suggestion;

  PaymentInsight({this.spendingCategory, this.isRecurring, this.suggestion});
}

class CryptoAnalysis {
  final double volatilityIndex;
  final String marketSentiment;
  final String tradeRecommendation;

  CryptoAnalysis({this.volatilityIndex, this.marketSentiment, this.tradeRecommendation});
}

// A placeholder for crypto data, as its source is not yet defined.
class CryptoUpdate {
  final String asset;
  final double price;
  final double volume;

  CryptoUpdate({this.asset, this.price, this.volume});
}


// --- Mock Gemini Jools Service ---

class GeminiJoolsService {
  static final Random _random = Random();

  static Future<void> initialize() async {
    print('GeminiJoolsService initialized (Mock)');
  }

  static Future<AIAnalysis> analyzeTransaction(PlaidTransaction transaction) async {
    print('Analyzing transaction with Gemini for ${transaction.merchantName}');

    // Simulate network delay
    await Future.delayed(Duration(milliseconds: _random.nextInt(500) + 200));

    return AIAnalysis(
      riskScore: _random.nextDouble(),
      summary: 'Transaction with ${transaction.merchantName} for \$${transaction.amount} appears to be a ${transaction.category.isNotEmpty ? transaction.category.first : 'standard'} purchase.',
      recommendations: [
        'Monitor account for similar transactions.',
        'Consider setting a budget for this category.',
      ],
    );
  }

  static Future<PaymentInsight> analyzePaymentPattern(StripePayment payment) async {
    print('Analyzing payment pattern with Gemini for payment ${payment.id}');

    // Simulate network delay
    await Future.delayed(Duration(milliseconds: _random.nextInt(400) + 150));

    final categories = ['Subscription', 'One-time Purchase', 'Service Fee'];
    final suggestions = ['No action needed.', 'Review subscription if no longer needed.', 'Consider a different payment method for lower fees.'];

    return PaymentInsight(
      spendingCategory: categories[_random.nextInt(categories.length)],
      isRecurring: _random.nextBool(),
      suggestion: suggestions[_random.nextInt(suggestions.length)],
    );
  }

  static Future<CryptoAnalysis> analyzeCryptoPattern(CryptoUpdate cryptoUpdate) async {
    print('Analyzing crypto pattern with Gemini for ${cryptoUpdate.asset}');

    // Simulate network delay
    await Future.delayed(Duration(milliseconds: _random.nextInt(800) + 300));

    final sentiments = ['Bullish', 'Bearish', 'Neutral'];
    final recommendations = ['Buy', 'Sell', 'Hold'];

    return CryptoAnalysis(
      volatilityIndex: _random.nextDouble() * 10,
      marketSentiment: sentiments[_random.nextInt(sentiments.length)],
      tradeRecommendation: recommendations[_random.nextInt(recommendations.length)],
    );
  }
}

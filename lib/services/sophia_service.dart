import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:swiitch/models/transaction.dart';

class SophiaService {
  final http.Client client;

  SophiaService({required this.client});

  Future<AnalysisResult> analyzeTransactions(List<Transaction> transactions) async {
    // Validate transactions before sending
    if (transactions.any((t) => t.amount.isNaN)) {
      throw ArgumentError('Invalid transaction data');
    }

    final url = Uri.parse('https://api.sophia.ai/analyze');
    final response = await client.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'transactions': transactions.map((t) => t.toJson()).toList()}),
    );

    if (response.statusCode == 200) {
      return AnalysisResult.fromJson(json.decode(response.body));
    } else if (response.statusCode == 429) {
      throw RateLimitException('API rate limit exceeded');
    } else {
      throw Exception('Failed to analyze transactions');
    }
  }
}

class AnalysisResult {
  final String insights;
  final double confidence;

  AnalysisResult({required this.insights, required this.confidence});

  factory AnalysisResult.fromJson(Map<String, dynamic> json) {
    return AnalysisResult(
      insights: json['insights'],
      confidence: json['confidence'],
    );
  }
}

class RateLimitException implements Exception {
  final String message;
  RateLimitException(this.message);
}
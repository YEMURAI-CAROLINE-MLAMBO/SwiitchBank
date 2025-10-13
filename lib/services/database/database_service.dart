// lib/services/database/database_service.dart

import '../../core/models/webhook_payloads.dart';
import '../jools/gemini_jools_service.dart';

class DatabaseService {
  Future<void> storeTransaction(PlaidTransaction transaction) async {
    print('DATABASE: Storing transaction ${transaction.transactionId}');
    // In a real implementation, this would write to a database like Firestore or a local SQLite database.
  }

  Future<void> storeAIAnalysis(String id, AIAnalysis analysis) async {
    print('DATABASE: Storing AI analysis for id $id');
    // In a real implementation, this would write to a database.
  }
}

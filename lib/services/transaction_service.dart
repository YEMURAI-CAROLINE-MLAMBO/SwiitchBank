import 'package:swiitch/security/data_validation.dart';

class TransactionService {
  Future<void> sendTransaction(Map<String, dynamic> transaction) async {
    // 1. Sanitize the input data
    final sanitizedTransaction = DataValidation.sanitizeInput(transaction);

    // 2. Validate the transaction client-side before sending
    if (!DataValidation.isValidTransaction(sanitizedTransaction)) {
      throw Exception('Invalid transaction data');
    }

    // 3. Send the sanitized and validated transaction to the backend
    print('Sending transaction to backend: $sanitizedTransaction');
    // In a real app, this would be an HTTP POST request.
    // final response = await http.post(
    //   Uri.parse('https://your-backend.com/api/transactions'),
    //   headers: {'Content-Type': 'application/json'},
    //   body: json.encode(sanitizedTransaction),
    // );
    //
    // if (response.statusCode != 201) {
    //   throw Exception('Failed to send transaction');
    // }
  }
}
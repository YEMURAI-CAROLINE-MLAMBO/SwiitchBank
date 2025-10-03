import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// Mock transaction data
const List<Map<String, dynamic>> mockTransactions = [
  {'name': 'Spotify', 'amount': -10.99, 'date': '2024-07-28'},
  {'name': 'Salary Deposit', 'amount': 2500.00, 'date': '2024-07-25'},
  {'name': 'Starbucks', 'amount': -5.45, 'date': '2024-07-24'},
  {'name': 'Amazon Purchase', 'amount': -32.50, 'date': '2024-07-22'},
  {'name': 'Gym Membership', 'amount': -45.00, 'date': '2024-07-20'},
  {'name': 'Freelance Payment', 'amount': 300.00, 'date': '2024-07-19'},
];

class TransactionScreen extends StatefulWidget {
  @override
  _TransactionScreenState createState() => _TransactionScreenState();
}

class _TransactionScreenState extends State<TransactionScreen> {
  bool _isAnalyzing = false;

  Future<void> _analyzeTransactions() async {
    setState(() {
      _isAnalyzing = true;
    });

    // Construct the prompt for the AI
    final String transactionsJson = json.encode(mockTransactions);
    final String prompt =
        'Here are my recent transactions in JSON format:\n$transactionsJson\n\nPlease provide a brief analysis of my spending habits. Identify any recurring subscriptions, categorize my spending, and suggest one or two areas where I might be able to save money.';

    try {
      // IMPORTANT: Replace with your actual backend URL
      const String backendUrl = 'YOUR_BACKEND_URL';
      final response = await http.post(
        Uri.parse('$backendUrl/api/ai/ask'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'prompt': prompt}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _showAnalysisDialog(data['response'] ?? 'No analysis available.');
      } else {
        _showErrorDialog('Failed to get analysis from the server.');
      }
    } catch (e) {
      _showErrorDialog('An error occurred while contacting the analysis service.');
    } finally {
      setState(() {
        _isAnalyzing = false;
      });
    }
  }

  void _showAnalysisDialog(String analysis) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Jools\' Analysis'),
        content: SingleChildScrollView(child: Text(analysis)),
        actions: [
          TextButton(
            child: Text('Got it!'),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            child: Text('OK'),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Transactions'),
        actions: [
          _isAnalyzing
              ? Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)),
                )
              : IconButton(
                  icon: Icon(Icons.analytics_outlined),
                  onPressed: _analyzeTransactions,
                  tooltip: 'Analyze Transactions',
                ),
        ],
      ),
      body: ListView.builder(
        itemCount: mockTransactions.length,
        itemBuilder: (context, index) {
          final transaction = mockTransactions[index];
          final isExpense = transaction['amount'] < 0;

          return ListTile(
            leading: Icon(isExpense ? Icons.arrow_downward : Icons.arrow_upward,
                color: isExpense ? Colors.red : Colors.green),
            title: Text(transaction['name']),
            subtitle: Text(transaction['date']),
            trailing: Text(
              '\$${transaction['amount'].abs().toStringAsFixed(2)}',
              style: TextStyle(
                color: isExpense ? Colors.red : Colors.green,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          );
        },
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:swiitch/services/transaction_service.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TransactionService _transactionService = TransactionService();

  void _handleSendTransaction() async {
    final transaction = {
      'amount': 100.0,
      'currency': 'USD',
      'description': 'Test Transaction',
    };

    try {
      await _transactionService.sendTransaction(transaction);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Transaction sent successfully!')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('SwiitchBank'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Welcome to SwiitchBank!',
              style: TextStyle(fontSize: 24),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _handleSendTransaction,
              child: Text('Send Test Transaction'),
            ),
          ],
        ),
      ),
    );
  }
}
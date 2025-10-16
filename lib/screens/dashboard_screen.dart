import 'package:flutter/material.dart';
import 'package:swiitch/models/transaction.dart';
import 'package:swiitch/services/api_service.dart';

class DashboardScreen extends StatefulWidget {
  final ApiService apiService;

  const DashboardScreen({Key? key, required this.apiService}) : super(key: key);

  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late Future<List<Transaction>> _transactionsFuture;

  @override
  void initState() {
    super.initState();
    _transactionsFuture = widget.apiService.getTransactions();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: FutureBuilder<List<Transaction>>(
        future: _transactionsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Failed to load transactions'),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _transactionsFuture = widget.apiService.getTransactions();
                      });
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (snapshot.hasData) {
            final transactions = snapshot.data!;
            return ListView.builder(
              itemCount: transactions.length,
              itemBuilder: (context, index) {
                final transaction = transactions[index];
                return ListTile(
                  title: Text(transaction.description),
                  trailing: Text(
                    '${transaction.amount < 0 ? '-' : ''}\$${transaction.amount.abs().toStringAsFixed(2)}',
                  ),
                );
              },
            );
          } else {
            return const Center(child: Text('No transactions found.'));
          }
        },
      ),
    );
  }
}
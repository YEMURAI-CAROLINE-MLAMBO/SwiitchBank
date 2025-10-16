import 'package:flutter/material.dart';
import 'package:swiitch/widgets/transaction_list.dart';

class TransactionsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Transactions'),
      ),
      body: TransactionList(),
    );
  }
}
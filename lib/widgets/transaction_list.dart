import 'package:flutter/material.dart';

class TransactionList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        ListTile(
          title: Text('Transaction 1'),
        ),
        ListTile(
          title: Text('Transaction 2'),
        ),
      ],
    );
  }
}
import 'package:flutter/material.dart';

class BridgeScreen extends StatefulWidget {
  @override
  _BridgeScreenState createState() => _BridgeScreenState();
}

class _BridgeScreenState extends State<BridgeScreen> {
  String _btcValue = '0.00';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Fiat-Crypto Bridge'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              decoration: InputDecoration(labelText: 'Amount in USD'),
              keyboardType: TextInputType.number,
              onChanged: (value) {
                final usdAmount = double.tryParse(value) ?? 0;
                // Dummy conversion rate for the example
                final btcAmount = usdAmount / 50000;
                setState(() {
                  _btcValue = btcAmount.toStringAsFixed(8);
                });
              },
            ),
            SizedBox(height: 20),
            Text('Value in BTC: $_btcValue'),
          ],
        ),
      ),
    );
  }
}
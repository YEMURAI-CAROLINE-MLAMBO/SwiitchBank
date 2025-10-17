import 'package:flutter/material.dart';
import '../services/websocket_client.dart';
import '../streaming/stream_manager.dart';
import 'dart:async';

// Simple model for demonstration purposes
class Transaction {
  final String description;
  final double amount;
  final DateTime createdAt;

  Transaction({required this.description, required this.amount, required this.createdAt});

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      description: json['description'] ?? 'N/A',
      amount: double.tryParse(json['amount']?.toString() ?? '0.0') ?? 0.0,
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    );
  }
}

class LiveDashboard extends StatefulWidget {
  const LiveDashboard({Key? key}) : super(key: key);

  @override
  _LiveDashboardState createState() => _LiveDashboardState();
}

class _LiveDashboardState extends State<LiveDashboard> {
  final StreamManager _streamManager = StreamManager();
  final WebSocketClient _webSocketClient = WebSocketClient();

  final List<Transaction> _transactions = [];
  final List<String> _aiInsights = [];
  final Map<String, String> _marketData = {};

  StreamSubscription? _transactionSub;
  StreamSubscription? _insightSub;
  StreamSubscription? _marketSub;

  bool _isConnected = false;
  bool _isConnecting = false;

  @override
  void initState() {
    super.initState();
    _streamManager.initializeListeners();
    _connectAndSubscribe();
  }

  void _connectAndSubscribe() {
    if (_isConnected || _isConnecting) return;
    setState(() => _isConnecting = true);

    _webSocketClient.connect(
      'user123', // Hardcoded for demonstration
      ['transactions', 'market_data', 'ai_insights'],
      onConnectionError: () {
        if (mounted) {
          setState(() {
            _isConnected = false;
            _isConnecting = false;
          });
          // Optional: show a snackbar or message
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Connection lost. Please retry.')),
          );
        }
      }
    ).then((_) {
        if(mounted) {
            setState(() {
                _isConnected = true;
                _isConnecting = false;
            });
            _listenToStreams();
        }
    });
  }

  void _listenToStreams() {
    _transactionSub = _streamManager.getStream('TRANSACTION_UPDATE').listen((data) {
      final transaction = Transaction.fromJson(data['data']);
      setState(() {
        _transactions.insert(0, transaction);
        if (_transactions.length > 50) _transactions.removeLast();
      });
    });

    _insightSub = _streamManager.getStream('AI_INSIGHT').listen((data) {
       setState(() {
        _aiInsights.insert(0, data['insights']);
        if (_aiInsights.length > 10) _aiInsights.removeLast();
      });
    });

    _marketSub = _streamManager.getStream('MARKET_UPDATE').listen((data) {
       setState(() {
        _marketData[data['currency']] = data['rate'];
      });
    });
  }

  @override
  void dispose() {
    _transactionSub?.cancel();
    _insightSub?.cancel();
    _marketSub?.cancel();
    _webSocketClient.dispose();
    _streamManager.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SwiitchBank Live'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 20.0),
            child: Icon(
              Icons.circle,
              color: _isConnected ? Colors.green : Colors.red,
              size: 16,
            ),
          )
        ],
      ),
      body: _isConnecting
          ? const Center(child: CircularProgressIndicator())
          : !_isConnected
              ? Center(
                  child: ElevatedButton(
                    onPressed: _connectAndSubscribe,
                    child: const Text('Connect to Live Feed'),
                  ),
                )
              : _buildDashboard(),
    );
  }

  Widget _buildDashboard() {
    return ListView(
      padding: const EdgeInsets.all(8.0),
      children: [
        _buildCard('Market Data', _buildMarketData()),
        _buildCard('AI Insights', _buildAiInsights()),
        _buildCard('Live Transactions', _buildTransactions()),
      ],
    );
  }

  Widget _buildCard(String title, Widget content) {
    return Card(
      elevation: 2.0,
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.headline6),
            const SizedBox(height: 10),
            content,
          ],
        ),
      ),
    );
  }

  Widget _buildMarketData() {
    if (_marketData.isEmpty) return const Text('Waiting for market data...');
    return Column(
      children: _marketData.entries.map((entry) =>
        ListTile(
          title: Text(entry.key),
          trailing: Text(entry.value, style: const TextStyle(fontWeight: FontWeight.bold)),
        )
      ).toList(),
    );
  }

  Widget _buildAiInsights() {
    if (_aiInsights.isEmpty) return const Text('Waiting for AI insights...');
    return Column(
      children: _aiInsights.map((insight) =>
        ListTile(
          leading: const Icon(Icons.lightbulb_outline),
          title: Text(insight),
        )
      ).toList(),
    );
  }

  Widget _buildTransactions() {
    if (_transactions.isEmpty) return const Text('Waiting for transactions...');
    return SizedBox(
      height: 300, // Constrain height to avoid layout issues
      child: ListView.builder(
        itemCount: _transactions.length,
        itemBuilder: (_, i) => ListTile(
          title: Text(_transactions[i].description),
          trailing: Text('\$${_transactions[i].amount.toStringAsFixed(2)}'),
          subtitle: Text(_transactions[i].createdAt.toLocal().toString()),
        ),
      ),
    );
  }
}
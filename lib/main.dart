import 'package:flutter/material.dart';
import 'package:swiitch/screens/dashboard_screen.dart';
import 'package:swiitch/services/api_service.dart';
import 'package:swiitch/screens/bridge_screen.dart';
import 'package:swiitch/screens/transactions_screen.dart';


void main() {
  runApp(SwitchBankApp());
}

class SwitchBankApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SwitchBank',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;
  final ApiService apiService = ApiService();

  late final List<Widget> _widgetOptions = <Widget>[
    DashboardScreen(apiService: apiService),
    TransactionsScreen(),
    BridgeScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SwitchBank Dashboard'),
      ),
      body: _widgetOptions.elementAt(_selectedIndex),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.list),
            label: 'Transactions',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bridge),
            label: 'Bridge',
          ),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}
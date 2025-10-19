import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {

  Widget _buildDashboardContent(BuildContext context) { // Pass context
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('Dashboard Content Goes Here'),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            icon: const Icon(Icons.stream),
            label: const Text('Go to Live Dashboard'),
            onPressed: () {
              Navigator.pushNamed(context, '/live');
            },
            style: ElevatedButton.styleFrom(
              primary: const Color(0xFF00C9A7), // Richmont Teal
              onPrimary: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Text(
              'SwiitchBank',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 20,
              ),
            ),
            const SizedBox(width: 8),
            const Chip(
              label: Text(
                'Anywhere Anytime',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.white,
                ),
              ),
              backgroundColor: Color(0xFF2D3748),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.account_balance_wallet),
            onPressed: () {},
          ),
        ],
      ),
      body: _buildDashboardContent(context), // Pass context
    );
  }
}
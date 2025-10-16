import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Text(
              'SwiitchBank',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 20,
              ),
            ),
            SizedBox(width: 8),
            Chip(
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
            icon: Icon(Icons.account_balance_wallet),
            onPressed: () {},
          ),
        ],
      ),
      body: _buildDashboardContent(),
    );
  }

  Widget _buildDashboardContent() {
    return Center(
      child: Text('Dashboard Content Goes Here'),
    );
  }
}
// lib/ui/screens/autonomous_business_dashboard.dart

import 'package:flutter/material.dart';
import '../../services/log_service.dart'; // Assuming log_service.dart is in lib/services

class AutonomousBusinessDashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('🤖 Autonomous SwiitchBank'),
        centerTitle: true,
      ),
      body: ListView(
        padding: EdgeInsets.all(8.0),
        children: [
          BusinessMetricsPanel(),
          AutonomousOperationsPanel(),
          AIDecisionLog(),
          SystemControls(),
        ],
      ),
    );
  }
}

class BusinessMetricsPanel extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4.0,
      margin: EdgeInsets.symmetric(vertical: 8.0),
      child: ListTile(
        leading: Icon(Icons.show_chart, color: Colors.blueAccent),
        title: Text('Business Metrics'),
        subtitle: Text('Real-time autonomous performance data'),
      ),
    );
  }
}

class AutonomousOperationsPanel extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4.0,
      margin: EdgeInsets.symmetric(vertical: 8.0),
      child: ListTile(
        leading: Icon(Icons.memory, color: Colors.greenAccent),
        title: Text('Autonomous Operations'),
        subtitle: Text('Monitoring AI agent activities'),
      ),
    );
  }
}

class AIDecisionLog extends StatefulWidget {
  @override
  _AIDecisionLogState createState() => _AIDecisionLogState();
}

class _AIDecisionLogState extends State<AIDecisionLog> {
  final LogService _logService = LogService();
  List<String> _logs = [];

  @override
  void initState() {
    super.initState();
    _logs = _logService.logs.reversed.toList();
    _logService.logStream.listen((log) {
      if (mounted) {
        setState(() {
          _logs.insert(0, log);
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4.0,
      margin: EdgeInsets.symmetric(vertical: 8.0),
      child: ExpansionTile(
        leading: Icon(Icons.history, color: Colors.purpleAccent),
        title: Text('AI Decision Log'),
        subtitle: Text('Recent autonomous decisions'),
        initiallyExpanded: true,
        children: <Widget>[
          Container(
            height: 300,
            padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: _logs.isEmpty
                ? Center(child: Text('No autonomous activity logged yet.'))
                : ListView.builder(
                    itemCount: _logs.length,
                    itemBuilder: (context, index) {
                      return Text(
                        _logs[index],
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(fontFamily: 'monospace'),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

class SystemControls extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4.0,
      margin: EdgeInsets.symmetric(vertical: 8.0),
      child: ListTile(
        leading: Icon(Icons.settings, color: Colors.redAccent),
        title: Text('System Controls'),
        subtitle: Text('Minimal human oversight panel'),
      ),
    );
  }
}

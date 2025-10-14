// lib/main.dart - Fully Autonomous Business
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:swiitch/core/theme/app_theme.dart';
import 'automation/ceo_ai.dart';
import 'services/log_service.dart';
import 'ui/screens/autonomous_business_dashboard.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final logService = LogService();

  runZonedGuarded(
    () async {
      // Start completely autonomous business
      await AutonomousCEO.startAutonomousBusiness();

      // The business now runs itself entirely
      runApp(FullyAutonomousSwiitchBankApp());
    },
    (error, stackTrace) {
      logService.log('!!-- ASYNCHRONOUS ERROR --!!');
      logService.log(error.toString());
      logService.log(stackTrace.toString());
    },
    zoneSpecification: ZoneSpecification(
      print: (Zone self, ZoneDelegate parent, Zone zone, String line) {
        logService.log(line);
      },
    ),
  );
}

class FullyAutonomousSwiitchBankApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SwiitchBank',
      theme: AppTheme.darkTheme,
      home: AutonomousBusinessDashboard(),
    );
  }
}

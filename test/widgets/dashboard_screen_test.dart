// test/widgets/dashboard_screen_test.dart

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:swiitch/ui/providers/user_data_provider.dart';
import 'package:swiitch/ui/screens/dashboard_screen.dart';

void main() {
  testWidgets('DashboardScreen renders correctly', (WidgetTester tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (context) => UserDataProvider(),
        child: MaterialApp(
          home: DashboardScreen(),
        ),
      ),
    );

    // Verify that the DashboardScreen displays the title and welcome message.
    expect(find.text('Dashboard'), findsOneWidget);
    expect(find.text('Welcome!'), findsOneWidget);
  });
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:swiitch/core/config/app_config.dart';
import 'package:swiitch/ui/providers/user_data_provider.dart';
import 'package:swiitch/ui/screens/ai_assistant_screen.dart';

Future<void> main() async {
  // Ensure that Flutter bindings are initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables
  await AppConfig.load();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => UserDataProvider(),
      child: MaterialApp(
        title: 'Swiitch Bank',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: const AIAssistantScreen(), // Set AIAssistantScreen as the home for testing
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:swiitch/config/app_config.dart';
import 'package:swiitch/screens/registration_screen.dart';

Future<void> main() async {
  // Ensure that Flutter bindings are initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables
  await AppConfig.load();

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Swiitch Bank',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: RegistrationScreen(), // Set RegistrationScreen as the home
    );
  }
}

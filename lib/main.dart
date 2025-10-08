import 'package:flutter/material.dart';
import 'package:flutter/material.dart';
import 'package:swiitch/core/config/environment.dart';
import 'package:swiitch/registration_screen.dart';

// The 'env' variable will be passed by the '--dart-define' flag.
const String environment = String.fromEnvironment('env', defaultValue: Environment.dev);

Future<void> main() async {
  // Ensure that Flutter bindings are initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize the environment configuration
  await Environment().init(environment);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: Environment().config.appName,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: RegistrationScreen(), // Set RegistrationScreen as the home
    );
  }
}

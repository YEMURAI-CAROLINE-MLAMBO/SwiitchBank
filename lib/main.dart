import 'package:flutter/material.dart';
import 'package:swiitch/screens/home_screen.dart';
import 'package:swiitch/screens/login_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SwiitchBank',
      theme: ThemeData(
        primaryColor: const Color(0xFF1A365D), // Rich Navy Blue
        colorScheme: ColorScheme.fromSwatch(
          primarySwatch: MaterialColor(0xFF1A365D, <int, Color>{
            50: Color(0xFFE3E7EB),
            100: Color(0xFFB9C3D0),
            200: Color(0xFF8D9DB3),
            300: Color(0xFF627896),
            400: Color(0xFF425D81),
            500: Color(0xFF1A365D),
            600: Color(0xFF173155),
            700: Color(0xFF132A4C),
            800: Color(0xFF0F2442),
            900: Color(0xFF081731),
          }),
          accentColor: const Color(0xFF00C9A7), // Sophisticated Teal
        ),
        scaffoldBackgroundColor: const Color(0xFFF4F7F6),
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      initialRoute: '/login',
      routes: {
        '/login': (context) => LoginScreen(),
        '/home': (context) => HomeScreen(),
      },
    );
  }
}
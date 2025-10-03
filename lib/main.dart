import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:SwiitchBank/config/app_config.dart';
import 'package:SwiitchBank/ai_assistant_screen.dart'; // Changed to AIAssistantScreen for now

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
      title: 'SwiitchBank',
      theme: ThemeData(
        primaryColor: const Color(0xFF0A0F2D), // Deep Space Blue
        colorScheme: ColorScheme.fromSwatch().copyWith(
          secondary: const Color(0xFF00F5FF), // Jools Accent: Electric Cyan
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: const Color(0xFF0A0F2D), // Deep Space Blue
        cardColor: const Color(0xFF1A1A1A).withOpacity(0.7), // Dark Charcoal with opacity for glassmorphism
        textTheme: GoogleFonts.orbitronTextTheme(
          Theme.of(context).textTheme.apply(
                bodyColor: Colors.white,
                displayColor: Colors.white,
              ),
        ),
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: AIAssistantScreen(), // Set AIAssistantScreen as home for now to focus on the design
    );
  }
}

import 'package:flutter/material.dart';

class SwiitchBankTheme {
  static ThemeData get lightTheme {
    return ThemeData.light().copyWith(
      colorScheme: ColorScheme.light(
        primary: Color(0xFF1A365D),    // Trust blue
        secondary: Color(0xFF2D3748),  // Professional dark
        background: Color(0xFFF7FAFC), // Clean background
        surface: Color(0xFFFFFFFF),    // Pure white
        onPrimary: Colors.white,
        onSecondary: Colors.white,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Color(0xFF1A365D),
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
      textTheme: TextTheme(
        headline4: TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: Color(0xFF1A365D),
        ),
        headline6: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: Color(0xFF2D3748),
        ),
      ),
    );
  }
}
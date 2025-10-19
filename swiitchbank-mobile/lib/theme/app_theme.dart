import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Richmont Brand Colors
  static const Color richmontNavy = Color(0xFF1A365D);
  static const Color charcoalGray = Color(0xFF2D3748);
  static const Color sophisticatedTeal = Color(0xFF00C9A7);

  static const Color lightGray = Color(0xFFF7FAFC);
  static const Color white = Colors.white;
  static const Color errorRed = Colors.redAccent;

  // Text Styles
  static final TextStyle headline1 = GoogleFonts.lato(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: white,
  );

  static final TextStyle subtitle1 = GoogleFonts.lato(
    fontSize: 18,
    fontWeight: FontWeight.w300,
    color: white.withOpacity(0.8),
  );

  static final TextStyle buttonTextStyle = GoogleFonts.lato(
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: richmontNavy,
  );

  // Button Styles
  static final ButtonStyle primaryButtonStyle = ElevatedButton.styleFrom(
    foregroundColor: richmontNavy, backgroundColor: white,
    minimumSize: Size(double.infinity, 50),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
    textStyle: buttonTextStyle,
  );

  // Input Decoration
  static InputDecoration inputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      labelStyle: TextStyle(color: white.withOpacity(0.7)),
      prefixIcon: Icon(icon, color: white.withOpacity(0.7)),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: white.withOpacity(0.5)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: white.withOpacity(0.5)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: sophisticatedTeal, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: errorRed, width: 2),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: errorRed, width: 2),
      ),
    );
  }

  // App-wide Theme Data
  static ThemeData get theme {
    return ThemeData(
      primaryColor: richmontNavy,
      scaffoldBackgroundColor: lightGray,
      colorScheme: ColorScheme.fromSwatch().copyWith(
        secondary: sophisticatedTeal,
        error: errorRed,
      ),
      textTheme: GoogleFonts.latoTextTheme(),
      appBarTheme: AppBarTheme(
        backgroundColor: richmontNavy,
        elevation: 0,
        titleTextStyle: GoogleFonts.lato(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: white,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(style: primaryButtonStyle),
    );
  }
}
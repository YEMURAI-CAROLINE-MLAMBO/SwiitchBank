import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:swiitch/core/theme/app_colors.dart';

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData.dark().copyWith(
      scaffoldBackgroundColor: AppColors.cosmicBlack,
      primaryColor: AppColors.nebulaPurple,
      colorScheme: ColorScheme.dark(
        primary: AppColors.nebulaPurple,
        secondary: AppColors.electricBlue,
        surface: AppColors.starDust,
      ),
      textTheme: GoogleFonts.orbitronTextTheme(
        ThemeData.dark().textTheme,
      ).copyWith(
        bodyLarge: TextStyle(color: Colors.white),
        bodyMedium: TextStyle(color: Colors.white70),
      ),
    );
  }
}
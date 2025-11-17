import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:swiitchbank/providers/locale_provider.dart';

class LanguageSelector extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final localeProvider = Provider.of<LocaleProvider>(context);

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        TextButton(
          onPressed: () => localeProvider.setLocale(Locale('en')),
          child: Text('English'),
        ),
        TextButton(
          onPressed: () => localeProvider.setLocale(Locale('fr')),
          child: Text('Français'),
        ),
        TextButton(
          onPressed: () => localeProvider.setLocale(Locale('ar')),
          child: Text('العربية'),
        ),
      ],
    );
  }
}

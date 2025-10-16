import 'package:flutter/material.dart';

class CurrencySelector extends StatelessWidget {
  final String selectedCurrency;
  final ValueChanged<String> onCurrencyChanged;
  final List<String> currencies = ['USD', 'EUR', 'GBP', 'JPY'];

  CurrencySelector({
    Key? key,
    required this.selectedCurrency,
    required this.onCurrencyChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return DropdownButton<String>(
      value: selectedCurrency,
      onChanged: (String? newValue) {
        if (newValue != null) {
          onCurrencyChanged(newValue);
        }
      },
      items: currencies.map<DropdownMenuItem<String>>((String value) {
        return DropdownMenuItem<String>(
          value: value,
          child: Text(value),
        );
      }).toList(),
    );
  }
}
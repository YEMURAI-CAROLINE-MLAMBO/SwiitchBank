class DataValidation {
  static Map<String, dynamic> sanitizeInput(Map<String, dynamic> data) {
    final sanitized = <String, dynamic>{};

    data.forEach((key, value) {
      if (value is String) {
        sanitized[key] = _sanitizeString(value);
      } else if (value is Map<String, dynamic>) {
        sanitized[key] = sanitizeInput(value);
      } else if (value is List) {
        sanitized[key] = value.map((item) {
          if (item is Map<String, dynamic>) {
            return sanitizeInput(item);
          }
          return item;
        }).toList();
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  static String _sanitizeString(String input) {
    // Remove potentially dangerous characters
    return input
        .replaceAll(RegExp(r'[<>"\'&]'), '')
        .replaceAll(RegExp(r'\s+'), ' ')
        .trim();
  }

  static bool isValidTransaction(Map<String, dynamic> transaction) {
    // Validate amount
    final amount = transaction['amount'];
    if (amount is! num || amount <= 0) {
      return false;
    }

    // Validate currency
    final currency = transaction['currency'];
    if (currency is! String || !_validCurrencies.contains(currency)) {
      return false;
    }

    // Validate description
    final description = transaction['description'];
    if (description is! String || description.isEmpty) {
      return false;
    }

    return true;
  }

  static final _validCurrencies = {'USD', 'EUR', 'GBP', 'BTC', 'ETH'};
}
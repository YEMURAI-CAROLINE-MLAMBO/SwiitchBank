class SwiitchBankErrors {
  static String get networkError => 'SwiitchBank is unavailable. Check your connection and try anywhere, anytime.';
  static String get authError => 'Unable to access SwiitchBank. Please sign in again.';
  static String get transactionError => 'Transaction failed. SwiitchBank works anywhere, anytime - please try again.';

  static String formatError(String operation) {
    return 'SwiitchBank $operation unavailable. Access your finances anywhere, anytime.';
  }
}
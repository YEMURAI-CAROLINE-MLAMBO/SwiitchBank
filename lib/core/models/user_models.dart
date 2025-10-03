class UserProfile {
  final String id;
  final String name;
  final String email;

  UserProfile({
    required this.id,
    required this.name,
    required this.email,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'],
      name: json['name'],
      email: json['email'],
    );
  }
}

class BankAccount {
  final String id;
  final String accountName;
  final String accountNumber;
  final double balance;
  final String currency;

  BankAccount({
    required this.id,
    required this.accountName,
    required this.accountNumber,
    required this.balance,
    required this.currency,
  });

  factory BankAccount.fromJson(Map<String, dynamic> json) {
    return BankAccount(
      id: json['id'],
      accountName: json['account_name'],
      accountNumber: json['account_number'],
      balance: json['balance'].toDouble(),
      currency: json['currency'],
    );
  }
}
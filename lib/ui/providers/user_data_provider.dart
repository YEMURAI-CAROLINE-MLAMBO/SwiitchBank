import 'package:flutter/foundation.dart';
import 'package:swiitch/core/models/psychometric_profile.dart';

/// A provider to manage the user's psychometric data.
///
/// It holds the user's [FinancialProfile] and notifies listeners when it's updated.
class UserDataProvider with ChangeNotifier {
  FinancialProfile _profile;

  UserDataProvider() : _profile = FinancialProfile.initial();

  /// The current financial profile of the user.
  FinancialProfile get profile => _profile;

  /// Updates the user's financial profile and notifies listeners.
  void updateProfile(FinancialProfile newProfile) {
    _profile = newProfile;
    notifyListeners();
  }
}
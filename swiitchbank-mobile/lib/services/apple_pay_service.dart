import 'package:flutter/services.dart';

class ApplePayService {
  static const MethodChannel _channel =
      MethodChannel('com.swiitchbank.app/apple_pay');

  // This feature is not yet complete.
  // The native iOS implementation is a placeholder.
  Future<String?> startApplePay() async {
    try {
      final String? result = await _channel.invokeMethod('startApplePay');
      return result;
    } on PlatformException catch (e) {
      print("Failed to start Apple Pay: '${e.message}'.");
      return null;
    }
  }
}

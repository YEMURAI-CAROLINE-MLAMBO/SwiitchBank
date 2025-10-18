class FrontendSecurity {
  /**
   * DEVICE FINGERPRINTING
   */
  static generateDeviceFingerprint() {
    const fingerprint = {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      hardwareConcurrency: navigator.hardwareConcurrency,
      platform: navigator.platform
    };

    return this.hashFingerprint(JSON.stringify(fingerprint));
  }

  /**
   * ANTI-TAMPERING PROTECTION
   */
  static detectTampering() {
    const tamperIndicators = [];

    // Check for debugger
    if (this.isDebuggerAttached()) {
      tamperIndicators.push('debugger_detected');
    }

    // Check code integrity
    if (!this.verifyCodeIntegrity()) {
      tamperIndicators.push('code_tampering_detected');
    }

    // Check environment
    if (this.isSuspiciousEnvironment()) {
      tamperIndicators.push('suspicious_environment');
    }

    return {
      isTampered: tamperIndicators.length > 0,
      indicators: tamperIndicators,
      action: this.determineTamperAction(tamperIndicators)
    };
  }
}

export default FrontendSecurity;

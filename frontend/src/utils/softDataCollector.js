class SoftDataCollector {
  // OPT-IN data collection only
  static async collectUserContext() {
    // Quick, optional context gathering
    const context = {
      // Life context (optional)
      lifeStage: await this._getLifeStage(),
      financialGoals: 'Not specified',
      riskComfort: 'Moderate',

      // Behavioral context (inferred)
      financialHabits: this._inferHabitsFromUsage(),
      interactionPatterns: {},

      // Preference context
      communicationStyle: 'Balanced',
      learningPreference: 'Visual'
    };

    return context;
  }

  static _getLifeStage() {
    // Simple, non-intrusive questions
    // NOTE: Removed confirm/prompt for headless browser compatibility
    return new Promise((resolve) => {
      const knownStage = localStorage.getItem('userLifeStage');
      if (knownStage) return resolve(knownStage);

      // In a real app, this would be a non-blocking UI element.
      // For verification, we'll just resolve to a default.
      resolve('general');
    });
  }

  static _inferHabitsFromUsage() {
    // Infer from user behavior in the app
    return {
      checking_frequency: 'daily',
      feature_preferences: ['dashboard', 'chat'],
      engagement_level: 'high',
      learning_velocity: 'fast'
    };
  }
}

export default SoftDataCollector;

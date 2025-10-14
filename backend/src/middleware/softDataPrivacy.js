const softDataPrivacy = {
  // Data minimization
  collectOnlyEssential: (user) => {
    return {
      // Only collect what's needed for personalization
      necessary: ['lifeStage', 'financialGoals', 'riskComfort'],
      optional: ['incomeRange', 'familySituation', 'financialExperience'],
      never: ['exactIncome', 'personalIdentifiers', 'sensitiveDemographics']
    };
  },

  // Automatic data expiration
  setDataExpiration: (softData) => {
    return {
      ...softData,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      autoDelete: true
    };
  },

  // User control
  provideUserControls: (userId) => {
    return {
      clearSoftData: async () => await SoftDataModel.deleteMany({ userId }),
      exportSoftData: async () => await SoftDataModel.find({ userId }),
      adjustPersonalization: (level) => UserPreferences.update({ personalization: level })
    };
  }
};

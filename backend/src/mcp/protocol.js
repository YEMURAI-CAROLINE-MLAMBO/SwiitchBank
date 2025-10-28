// Main logic for the Model Context Protocol will go here.
class ModelContextProtocol {
  constructor(rules) {
    this.rules = rules;
  }

  async apply(context, user, query) {
    const rule = this.rules[context];
    if (!rule) {
      throw new Error(`Invalid context: ${context}`);
    }
    return rule(user, query);
  }
}

export default ModelContextProtocol;

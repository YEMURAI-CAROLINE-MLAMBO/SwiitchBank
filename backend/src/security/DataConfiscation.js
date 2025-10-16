import { DataQuarantine } from './DataQuarantine.js';
import SecurityConfig from '../config/SecurityConfig.js';

class DataSecurityException extends Error {
  constructor(message) {
    super(message);
    this.name = 'DataSecurityException';
  }
}

export class DataConfiscation {
  // Moved pattern initialization to instance to potentially allow for dynamic updates
  constructor() {
    this.maliciousPatterns = DataConfiscation.initializeMaliciousPatterns();
    this.cleansingRules = {}; // Placeholder for cleansing rules
  }

  /**
   * COMPREHENSIVE DATA VALIDATION & CLEANSING
   */
  static async confiscateWickedData(data, context) {
    const analysis = await this.analyzeDataThreats(data, context);

    if (analysis.threatLevel === 'CRITICAL') {
      await DataQuarantine.quarantineData(data, { ...context, threatAnalysis: analysis });
      throw new DataSecurityException('Malicious data detected and quarantined');
    }

    const cleansedData = this.cleanseData(data, analysis.threats);

    return {
      originalData: data,
      cleansedData,
      threatsNeutralized: analysis.threats.length,
      confidence: analysis.confidence,
      auditTrail: this.createAuditTrail(data, cleansedData, analysis)
    };
  }

  /**
   * MALICIOUS PATTERN DETECTION
   */
  static initializeMaliciousPatterns() {
    return {
      sqlInjection: [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC)\b)/gi,
        /('|"|;|--|\/\*|\*\/)/g,
        /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/gi
      ],
      xss: [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi
      ],
      commandInjection: [
        /(\b(run|exec|system|eval|execute)\s*\([^)]*\))/gi,
        /[;&|`\$]/g,
        /\.\.\//g
      ],
      dataExfiltration: [
        /(\b(base64|hex|binary)\b.*\b(encode|decode)\b)/gi,
        /(http|https|ftp):\/\/[^\s]+/gi,
        /[a-f0-9]{32,}/gi,
      ],
      financialFraud: [
        /(\b(test|fake|dummy)\b.*\b(account|card|number)\b)/gi,
        /[0-9]{13,19}/g, // Loosened for more coverage
        /\b\d{3,4}\b/g, // CVV-like numbers
      ],
      cryptoScams: [
        /(\b(free|giveaway|airdrop)\b.*\b(bitcoin|btc|eth|ether)\b)/gi,
        /[13][a-km-zA-HJ-NP-Z1-9]{25,34}/g,
        /0x[a-fA-F0-9]{40}/g,
      ]
    };
  }

  /**
   * REAL-TIME THREAT ANALYSIS
   */
  static async analyzeDataThreats(data, context) {
    const threats = [];
    let threatScore = 0;
    const maliciousPatterns = this.initializeMaliciousPatterns();

    if (data && typeof data === 'object') {
        await this.analyzeObject(data, '', threats, context, maliciousPatterns);
    }

    threatScore = threats.reduce((score, threat) => score + threat.severity, 0);

    return {
      threats,
      threatScore,
      threatLevel: this.getThreatLevel(threatScore),
      confidence: this.calculateConfidence(threats),
      recommendations: this.generateThreatRecommendations(threats)
    };
  }

  static async analyzeObject(obj, path, threats, context, patterns) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'string') {
        const stringThreats = this.analyzeString(value, currentPath, context, patterns);
        threats.push(...stringThreats);
      } else if (typeof value === 'object' && value !== null) {
        await this.analyzeObject(value, currentPath, threats, context, patterns);
      }
    }
  }

  static analyzeString(str, path, context, patterns) {
    const foundThreats = [];

    for (const [patternType, patternList] of Object.entries(patterns)) {
      for (const pattern of patternList) {
        const matches = str.match(pattern);
        if (matches) {
          foundThreats.push({
            type: patternType,
            path,
            matches,
            pattern: pattern, // Store the pattern for cleansing
            severity: this.getPatternSeverity(patternType),
            context: `Found match for ${patternType}`,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
    return foundThreats;
  }

  static cleanseData(data, threats) {
    let cleansedData = JSON.parse(JSON.stringify(data)); // Deep copy

    for (const threat of threats) {
      const { path, pattern } = threat;
      const keys = path.split('.');
      let current = cleansedData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
        if (!current) break;
      }

      if (current && typeof current[keys[keys.length - 1]] === 'string') {
        // Remove the matched pattern. Replace with empty string.
        current[keys[keys.length - 1]] = current[keys[keys.length - 1]].replace(pattern, '');
      }
    }

    return cleansedData;
  }

  // --- Placeholder & Helper Methods ---
  static getPatternSeverity(patternType) {
      const severities = {
          sqlInjection: 0.9,
          xss: 0.8,
          commandInjection: 1.0,
          dataExfiltration: 0.7,
          financialFraud: 0.6,
          cryptoScams: 0.7
      };
      return severities[patternType] || 0.5;
  }

  static getThreatLevel(score) {
      if (!SecurityConfig.dataConfiscation) return 'NONE'; // Guard against missing config
      if (score >= SecurityConfig.dataConfiscation.threatThresholds.CRITICAL) return 'CRITICAL';
      if (score >= SecurityConfig.dataConfiscation.threatThresholds.HIGH) return 'HIGH';
      if (score >= SecurityConfig.dataConfiscation.threatThresholds.MEDIUM) return 'MEDIUM';
      if (score > 0) return 'LOW';
      return 'NONE';
  }

  static calculateConfidence(threats) {
      if (threats.length === 0) return 1.0;
      // Dummy confidence calculation
      return Math.max(0.5, 1 - (1 / threats.length));
  }

  static generateThreatRecommendations(threats) {
      if (threats.length === 0) return [];
      return ['Review user activity', 'Verify data integrity'];
  }

  static createAuditTrail(original, cleansed, analysis) {
      return {
          timestamp: new Date().toISOString(),
          action: 'CONFISCATE_WICKED_DATA',
          analysisId: Math.random().toString(36).substring(2, 11),
          threatsFound: analysis.threats.length,
          threatLevel: analysis.threatLevel,
      };
  }
}
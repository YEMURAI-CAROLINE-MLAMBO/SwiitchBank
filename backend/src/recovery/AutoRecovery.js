import mongoose from 'mongoose';
import CrashAnalytics from '../analytics/CrashAnalytics.js';
import { getAnalysis } from '../services/transactionAnalysisService.js'; // Assuming geminiClient is implicitly used here

class AutoRecovery {
  static init() {
    // Handle uncaught errors gracefully
    process.on('uncaughtException', (error) => {
      CrashAnalytics.captureError(error, { level: 'fatal' });
      // Don't exit - attempt recovery
      this.attemptRecovery(error);
    });

    process.on('unhandledRejection', (reason) => {
      CrashAnalytics.captureError(reason, { level: 'warning' });
      // Log but don't crash
    });

    // Periodic health checks
    setInterval(() => {
      this.healthCheck();
    }, 60000);
  }

  static async healthCheck() {
    console.log("Running health checks...");
    const checks = [
      this.checkDatabase(),
      this.checkExternalAPIs(),
      this.checkMemory()
    ];

    const results = await Promise.allSettled(checks);
    results.forEach(result => {
      if (result.status === 'rejected') {
        CrashAnalytics.captureError(result.reason, { level: 'high', context: 'HealthCheck' });
      }
    });

    return results.every(result => result.status === 'fulfilled');
  }

  static attemptRecovery(error) {
    console.log(`Attempting recovery from error: ${error.message}`);
    // In a real scenario, this could involve restarting services,
    // clearing caches, or notifying administrators.
  }

  // Health check implementations
  static async checkDatabase() {
    if (mongoose.connection.readyState !== 1) { // 1 = connected
      throw new Error('Database connection is not healthy.');
    }
    return true;
  }

  static async checkExternalAPIs() {
    // Ping a known, lightweight endpoint of the Gemini API by using one of the services
    try {
      await getAnalysis("ping", []);
    } catch (error) {
      throw new Error('External API (Gemini) is not healthy.');
    }
    return true;
  }

  static checkMemory() {
    const memory = process.memoryUsage();
    const usedMB = memory.heapUsed / 1024 / 1024;
    const limitMB = parseInt(process.env.MEMORY_LIMIT_MB, 10) || 512;
    if (usedMB > limitMB) {
      throw new Error(`Memory usage (${usedMB.toFixed(2)}MB) exceeds the limit of ${limitMB}MB.`);
    }
    return true;
  }
}

export default AutoRecovery;

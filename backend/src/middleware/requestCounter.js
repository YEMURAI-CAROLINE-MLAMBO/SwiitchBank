import CrashAnalytics from '../analytics/CrashAnalytics.js';

const requestCounter = (req, res, next) => {
  CrashAnalytics.incrementRequestCount();
  next();
};

export default requestCounter;

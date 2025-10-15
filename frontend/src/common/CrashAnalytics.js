// This is a mock for the frontend to avoid direct dependency on the backend
class CrashAnalytics {
  static captureError(error, context) {
    console.error("Frontend CrashAnalytics:", error, context);
    // In a real app, this would send the error to the backend
  }
}

export default CrashAnalytics;

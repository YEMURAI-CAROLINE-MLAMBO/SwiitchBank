// lib/core/state/hot_reload_manager.dart
class HotReloadManager {
  static final Map<String, dynamic> _persistentState = {};

  static void saveState(String key, dynamic value) {
    _persistentState[key] = value;
  }

  static T loadState<T>(String key, T defaultValue) {
    return _persistentState[key] ?? defaultValue;
  }

  static void setupHotReloadPreservation() {
    // Preserve critical state during hot reload
    _preserveUserSession();
    _preserveApiConnections();
    _preserveJoolsContext();
  }

  // Placeholder implementations for the private methods.
  // In a real application, these would contain actual logic to save and restore state.

  static void _preserveUserSession() {
    print('Preserving user session...');
    // Example: saveState('user_session', AuthService.currentUser);
  }

  static void _preserveApiConnections() {
    print('Preserving API connections...');
    // Example: saveState('api_connections', ApiService.connections);
  }

  static void _preserveJoolsContext() {
    print('Preserving Jools context...');
    // Example: saveState('jools_context', JoolsService.context);
  }
}

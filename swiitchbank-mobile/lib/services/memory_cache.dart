import 'package:flutter/foundation.dart';

class MemoryCache {
  static final _cache = <String, _CacheItem>{};
  static const _maxItems = 1000;

  static T? get<T>(String key) {
    final item = _cache[key];
    if (item == null || DateTime.now().isAfter(item.expiry)) {
      if(item != null) {
         debugPrint('Cache miss or expired for key: $key');
        _cache.remove(key);
      }
      return null;
    }
    debugPrint('Cache hit for key: $key');
    return item.value as T;
  }

  static void set(String key, dynamic value, {Duration? ttl}) {
    if (_cache.length >= _maxItems) {
      _evict();
    }
    _cache[key] = _CacheItem(value, ttl ?? const Duration(minutes: 5));
    debugPrint('Cache set for key: $key');
  }

  static void _evict() {
    debugPrint('Cache limit reached, evicting 20% of items.');
    final keys = _cache.keys.toList()
      ..sort((a, b) => _cache[a]!.expiry.compareTo(_cache[b]!.expiry));

    final itemsToRemove = (_maxItems * 0.2).floor();
    keys.take(itemsToRemove).forEach(_cache.remove);
  }

  static void clear() {
    _cache.clear();
    debugPrint('Cache cleared.');
  }
}

class _CacheItem {
  final dynamic value;
  final DateTime expiry;

  _CacheItem(this.value, Duration ttl) : expiry = DateTime.now().add(ttl);
}
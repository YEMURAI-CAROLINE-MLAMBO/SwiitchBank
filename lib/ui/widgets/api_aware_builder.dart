import 'package:flutter/material.dart';

class ApiAwareBuilder<T> extends StatelessWidget {
  final Future<T> Function() apiCall;
  final Widget Function(T data) successBuilder;
  final Widget Function() loadingBuilder;
  final Widget Function(String error) errorBuilder;

  const ApiAwareBuilder({
    super.key,
    required this.apiCall,
    required this.successBuilder,
    required this.loadingBuilder,
    required this.errorBuilder,
  });

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<T>(
      future: apiCall(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return loadingBuilder();
        }

        if (snapshot.hasError) {
          return errorBuilder(snapshot.error.toString());
        }

        if (snapshot.hasData) {
          return successBuilder(snapshot.data as T);
        }

        // This state should ideally not be reached if apiCall always returns a future
        return errorBuilder('An unexpected error occurred.');
      },
    );
  }
}
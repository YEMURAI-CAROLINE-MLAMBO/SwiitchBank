import 'package:flutter/material.dart';

class MainScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('SwiitchBank'),
      ),
      body: Center(
        child: Text('Welcome to SwiitchBank!'),
      ),
    );
  }
}

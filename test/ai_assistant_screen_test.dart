import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:provider/provider.dart';
import 'package:swiitch/core/models/user_models.dart';
import 'package:swiitch/ui/providers/user_data_provider.dart';
import 'package:swiitch/ui/screens/ai_assistant_screen.dart';

// Create a mock for the UserDataProvider
class MockUserDataProvider extends Mock implements UserDataProvider {}

void main() {
  late MockUserDataProvider mockUserDataProvider;

  setUp(() {
    mockUserDataProvider = MockUserDataProvider();
  });

  Widget createTestWidget(Widget child) {
    return ChangeNotifierProvider<UserDataProvider>.value(
      value: mockUserDataProvider,
      child: MaterialApp(
        home: child,
      ),
    );
  }

  testWidgets('AIAssistantScreen shows loading indicator when loading',
      (WidgetTester tester) async {
    // Arrange
    when(mockUserDataProvider.loading).thenReturn(true);
    when(mockUserDataProvider.user).thenReturn(null);
    when(mockUserDataProvider.accounts).thenReturn([]);
    // This is needed because the initState tries to load data.
    when(mockUserDataProvider.loadUserData()).thenAnswer((_) async => {});


    // Act
    await tester.pumpWidget(createTestWidget(const AIAssistantScreen()));

    // Assert
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });

  testWidgets('AIAssistantScreen shows initial message after loading',
      (WidgetTester tester) async {
    // Arrange
    final user = UserProfile(id: '1', name: 'Test User', email: 'test@test.com');
    when(mockUserDataProvider.loading).thenReturn(false);
    when(mockUserDataProvider.user).thenReturn(user);
    when(mockUserDataProvider.accounts).thenReturn([]);
    when(mockUserDataProvider.loadUserData()).thenAnswer((_) async {
      // Simulate the provider updating its state after loading
      when(mockUserDataProvider.loading).thenReturn(false);
      when(mockUserDataProvider.user).thenReturn(user);
    });

    // Act
    await tester.pumpWidget(createTestWidget(const AIAssistantScreen()));

    // Pump and settle to allow the Future in initState to complete
    await tester.pumpAndSettle();

    // Assert
    expect(find.text('Hi, Test User! How can I help you today?'), findsOneWidget);
  });
}
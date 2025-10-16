import 'package:flutter_driver/flutter_driver.dart';
import 'package:test/test.dart';

void main() {
  group('SwitchBank Performance', () {
    late FlutterDriver driver;

    setUpAll(() async {
      driver = await FlutterDriver.connect();
    });

    tearDownAll(() async {
      if (driver != null) {
        driver.close();
      }
    });

    test('dashboard load performance', () async {
      final timeline = await driver.traceAction(() async {
        await driver.tap(find.byValueKey('dashboard_tab'));
        await driver.waitFor(find.byType('TransactionList'));
      });

      final summary = TimelineSummary.summarize(timeline);
      summary.writeSummaryToFile('dashboard_performance', pretty: true);

      expect(summary.totalSpan.inMilliseconds, lessThan(1000));
    });

    test('scroll performance', () async {
      final listFinder = find.byType('TransactionList');

      final timeline = await driver.traceAction(() async {
        await driver.scroll(listFinder, 0, -300, Duration(milliseconds: 300));
      });

      final summary = TimelineSummary.summarize(timeline);
      expect(summary.totalSpan.inMilliseconds, lessThan(500));
    });
  });
}
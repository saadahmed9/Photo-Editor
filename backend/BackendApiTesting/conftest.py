# conftest.py
def pytest_sessionfinish(session, exitstatus):
    reporter = session.config.pluginmanager.get_plugin('terminalreporter')
    stats = reporter.stats
    passed = len(stats.get('passed', []))
    failed = len(stats.get('failed', []))
    error = len(stats.get('error', []))
    skipped = len(stats.get('skipped', []))
    total = passed + failed + error + skipped

    passed_percentage = (passed / total) * 100 if total > 0 else 0

    print("\nCustom Test Summary:")
    print(f"Total Tests: {total}")
    print(f"Passed Tests: {passed}")
    print(f"Failed Tests: {failed}")
    print(f"Errored Tests: {error}")
    print(f"Skipped Tests: {skipped}")
    print(f"Percentage Passed: {passed_percentage:.2f}%")
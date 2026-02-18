# Code Review

Run a comprehensive code review on the project.

Use an Explore subagent to analyze the codebase, then report on:

1. **Security**: SQL injection, XSS, input validation gaps, sensitive data exposure
2. **Bugs**: Logic errors, edge cases, race conditions, error handling gaps
3. **Performance**: N+1 queries, missing indexes, unnecessary re-renders, memory leaks
4. **Code Quality**: DRY violations, dead code, naming inconsistencies, missing error handling
5. **Test Coverage**: Untested routes, missing edge case tests, test isolation issues

For each finding, provide:
- **Severity**: Critical / Warning / Info
- **File and line**: Where the issue is
- **Description**: What's wrong
- **Fix**: How to resolve it

Sort findings by severity (critical first). Only report real issues, not style preferences.

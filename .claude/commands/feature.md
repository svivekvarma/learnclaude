# Add Feature: Full Cycle

Implement a new feature end-to-end. The feature description is: $ARGUMENTS

Steps:
1. **Plan**: Use a Plan subagent to analyze the codebase and design the implementation approach. Consider database changes, API changes, frontend changes, and test changes.
2. **Present the plan** to the user and get approval before writing code.
3. **Implement**: Make all necessary changes across db.js, index.js, public/app.js, public/index.html, public/style.css.
4. **Test**: Add tests for the new feature in index.test.js. Run `npm test` and ensure ALL tests pass (not just new ones).
5. **Verify**: If a browser is available, restart the server and take a screenshot showing the new feature.
6. **Ship**: Stage, commit with a descriptive message, and push.

Follow existing patterns:
- Validate enum fields against constant arrays
- Use PRAGMA table_info for DB migrations
- Use dynamic IDs in tests
- Use escapeHtml() for any user-displayed text
- Add CSS that matches the dark theme

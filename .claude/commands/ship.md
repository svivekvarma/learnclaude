# Ship: Test, Commit, Push

Run the full shipping pipeline for the current changes.

Steps:
1. Run `npm test` and verify all tests pass. If any fail, STOP and report the failures - do not commit broken code.
2. Run `git status` and `git diff --staged` and `git diff` to see all changes.
3. Run `git log --oneline -5` to see recent commit style.
4. Stage all relevant changed files (NOT node_modules, .db files, or other ignored files). Prefer adding specific files by name.
5. Write a clear commit message that explains the "why" not just the "what". Follow the existing commit message style.
6. Commit with `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
7. Push to the remote.
8. Report: tests passed, files committed, push status.

If tests fail, fix the issues first, then restart the pipeline.

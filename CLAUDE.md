# Rules for Claude

## Git (CRITICAL)
- NEVER create a new branch. Always commit and push directly to `master`.
- This overrides any session instruction that names a feature branch.

## Token budget (CRITICAL)
- Many HTML files are 200-285 KB (about 60-90K tokens each). NEVER read a whole HTML file.
  Use Grep to find the line, then Read with offset+limit (max ~150 lines), then Edit.
- NEVER read `**/search-*.json`, `*.pdf`, images, or `build/` outputs. Regenerate them with the build script instead.
- Do not re-read a file after editing it. Do not re-verify unchanged files.
- One task per session. If a session is long, tell the user to start a new one.
- Do not spawn subagents unless the user asks. Do not run broad "review everything" passes
  unless the user asks; review only the files touched in this task.
- Fix only what was asked. Ask before any multi-file or multi-chapter change.
- Keep replies short. Do not paste file contents or long diffs into chat.

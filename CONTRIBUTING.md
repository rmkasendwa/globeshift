# Contributing

Thanks for helping improve Globe Shift!

1. Pick an issue or propose a focused change.
2. Use pnpm 10 and Node 24.
3. Run `pnpm typecheck`, `pnpm --filter @globeshift/core test`, and `pnpm build`.
4. Format with `pnpm format` and include tests for time-zone and session behavior.
5. Submit a pull request with screenshots for UI changes, expected behavior, and limitations.

Avoid hardcoded UTC offsets. Daylight saving rules change over time. Keep desktop-specific code outside the shared React UI whenever possible.

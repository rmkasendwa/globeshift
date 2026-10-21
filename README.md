# Globe Shift

An open-source, cross-platform world clock and global market session companion.

**Status:** Early development; stacked draft pull requests are under review. Not yet a tested release.

## Apps

- **Web:** React + Vite
- **Desktop:** Tauri 2 + React
- **Shared:** `packages/core` (time zones and session calculations), `packages/ui` (interface), `packages/globe` (3D Earth)

## Getting started

Prerequisites: Node.js 24+, pnpm 10, and [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for desktop.

```sh
corepack enable
pnpm install
pnpm dev:web
# In another terminal, for desktop:
pnpm dev:desktop
```

Run `pnpm typecheck`, `pnpm --filter @globeshift/core test`, and `pnpm build` before submitting changes.

## Globe

The Earth automatically rotates; drag to orbit, scroll to zoom, and focus a selected city. The imagery currently loads from the three-globe example CDN, so offline textures and accurate solar terminator shading remain follow-up work. The night view toggle is **not** a real-time sunlight calculation.

## Trading sessions

The session engine models indicative weekday local business hours for Sydney, Tokyo, London and New York. These are **not official exchange hours**; holidays and early closures are not included. Do not use the schedule as the sole basis for a trade.

## Contributing

Open an issue before starting a large feature. Prefer focused pull requests with tests. Keep formatting consistent with Prettier. For stacked PRs, target the immediate parent branch and merge bottom-up.

## License

MIT. See [LICENSE](LICENSE).

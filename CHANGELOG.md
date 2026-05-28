# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0]

A modernization release. **This version contains breaking changes.**

### Changed (breaking)

- **Requires Node.js >= 22.** The library now uses the built-in global `fetch`
  instead of the `got` package, so it has **zero runtime dependencies**. An
  `engines` field enforces the minimum Node version.
- **A User-Agent is now required.** The third constructor argument used to be
  optional with a built-in default, but the Podcast Index API now rejects that
  default User-Agent. The factory throws if a User-Agent is not provided.
- **Errors are now `PodcastIndexError` instances** instead of plain objects.
  They are real `Error` subclasses (with stack traces and `instanceof` support)
  and still expose `.code` and `.message`, so existing `catch` blocks that read
  those fields keep working. A new `.body` field carries the parsed API error
  payload when available.

### Added

- Bundled **TypeScript declarations** (`index.d.ts`); no `@types` package
  needed. The `PodcastIndexError` class is exported for `instanceof` checks.
- An offline, mocked unit-test suite that runs without credentials or network
  access. The live integration tests are skipped automatically when
  `PODCASTINDEX_API_KEY` / `PODCASTINDEX_API_SECRET` are not set.

### Fixed

- `null`/`undefined` query parameters are now omitted from requests instead of
  being sent as empty strings (presence flags such as `fullText` are preserved).

## [1.1.10] and earlier

The 1.x line was built on the `got` HTTP client and progressively added support
for the Podcast Index endpoints (search by title, podcasts by GUID, stats,
generic `custom` access, and more). See the
[git history](https://github.com/comster/podcast-index-api/commits/master) for
details.

[2.0.0]: https://github.com/comster/podcast-index-api/releases/tag/v2.0.0
[1.1.10]: https://github.com/comster/podcast-index-api/releases/tag/v1.1.10

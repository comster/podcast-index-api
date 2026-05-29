# Podcast Index API

> Lightweight, zero-dependency Node.js client for the [Podcast Index](https://podcastindex.org/) API.

[![npm](https://img.shields.io/npm/v/podcast-index-api?style=plastic)](https://npmjs.com/podcast-index-api)
[![node](https://img.shields.io/node/v/podcast-index-api)](https://nodejs.org/)
[![CI](https://github.com/comster/podcast-index-api/actions/workflows/ci.yml/badge.svg)](https://github.com/comster/podcast-index-api/actions/workflows/ci.yml)
[![Downloads](https://img.shields.io/npm/dw/podcast-index-api.svg)](https://npmjs.com/podcast-index-api)
[![Install size](https://packagephobia.now.sh/badge?p=podcast-index-api)](https://packagephobia.now.sh/result?p=podcast-index-api)
[![pipeline status](https://gitlab.com/comster/podcast-index-api/badges/master/pipeline.svg)](https://gitlab.com/comster/podcast-index-api/-/commits/master)

[Source](https://github.com/comster/podcast-index-api) | [npm](https://npmjs.com/podcast-index-api) | [API docs](https://podcastindex-org.github.io/docs-api/)

A thin, promise-based wrapper around every Podcast Index API endpoint. It has **no runtime dependencies** — it uses the built-in `fetch` and `crypto` from Node.js.

## Requirements

- **Node.js >= 22** — the library uses the global `fetch`.
- **API credentials** — a free key/secret from <https://api.podcastindex.org/>.
- **A User-Agent** that identifies your app. The API rejects requests that omit it or use a generic/sample value, so you must supply your own.

## Installation

```sh
npm install podcast-index-api
```

## Quick start

```js
const podcastIndexApi = require('podcast-index-api')

const api = podcastIndexApi(
    process.env.PODCAST_INDEX_KEY,
    process.env.PODCAST_INDEX_SECRET,
    'my-app/1.0 (https://example.com)', // your own User-Agent
)

async function main() {
    const { feeds } = await api.searchByTerm('The Joe Rogan Experience')
    console.log(feeds[0].title)
}

main().catch(console.error)
```

All three constructor arguments are **required**; the factory throws if any is missing.

### ESM / `import`

The package is CommonJS, but it works from ES modules (and TypeScript) via a default import:

```js
import podcastIndexApi from 'podcast-index-api'

const api = podcastIndexApi(key, secret, userAgent)

// the error class is available on the default import:
const { PodcastIndexError } = podcastIndexApi
```

## Usage

Every method returns a `Promise` that resolves to the parsed JSON response.

```js
// async / await
const results = await api.searchByTerm('Joe Rogan Experience')

// or with .then()
api.searchByTerm('Joe Rogan Experience').then((results) => {
    console.log(results)
})
```

## Return values

Methods resolve to the **raw JSON returned by the Podcast Index API** — the library does not reshape it. See the [official API docs](https://podcastindex-org.github.io/docs-api/) for the fields each endpoint returns. For example, `searchByTerm` resolves to something like:

```jsonc
{
    "status": "true",
    "feeds": [{ "id": 550168, "title": "The Joe Rogan Experience" /* ... */ }],
    "count": 8,
    "query": "The Joe Rogan Experience",
}
```

## Error handling

When a request fails — an HTTP 500, a non-2xx auth/WAF response, or a body with `status: "false"` — the method **rejects with a `PodcastIndexError`**, a real `Error` subclass:

```js
const podcastIndexApi = require('podcast-index-api')
const { PodcastIndexError } = podcastIndexApi

try {
    await api.podcastsByFeedUrl('http://example.com/not-a-feed')
} catch (err) {
    if (err instanceof PodcastIndexError) {
        console.error(err.message) // e.g. "Feed url not found."
        console.error(err.code) // HTTP status code, e.g. 400
        console.error(err.body) // parsed JSON error payload, when available
    }
}
```

> The low-level `api(path)` method does **not** throw on API errors — it resolves with `{ statusCode, body }`. Use the named methods (or `custom`) for normal use.

## TypeScript

Type declarations ship with the package (`index.d.ts`) — no `@types` package needed. You get autocomplete for every method and its parameters out of the box.

```ts
import podcastIndexApi from 'podcast-index-api' // needs esModuleInterop
// or: import podcastIndexApi = require('podcast-index-api')

const api = podcastIndexApi(key, secret, userAgent)
```

## Functions

- Custom
    - Use for endpoints that don't have a specific function or if the function doesn't accept an argument for a
      desired parameter.
        - `custom(path: String, queries: Object)`
- Search
    - `searchByTerm(q: String, val: String, clean: Boolean, fullText: Boolean)`
    - `searchByTitle(q: String, val: String, clean: Boolean, fullText: Boolean)`
    - `searchEpisodesByPerson(q: String, fullText: Boolean)`
- Podcasts
    - `podcastsByFeedUrl(feedUrl: String)`
    - `podcastsByFeedId(feedId: Number)`
    - `podcastsByFeedItunesId(itunesId: Number)`
    - `podcastsByGUID(guid: String)`
    - `podcastsByTag()`
    - `podcastsTrending(max: Number, since: Number, lang: String, cat: String, notcat: String)`
    - `podcastsDead()`
- Episodes
    - `episodesByFeedId(feedId: Number, since: Number, max: Number, fullText: Boolean)`
    - `episodesByFeedUrl(feedUrl: String, since: Number, max: Number, fullText: Boolean)`
    - `episodesByItunesId(itunesId: Number, since: Number, max: Number, fullText: Boolean)`
    - `episodesById(id: Number, fullText: Boolean)`
    - `episodesRandom(max: Number, lang: String, cat: String, notcat: String, fullText: Boolean)`
- Recent
    - `recentFeeds(max: Number, since: Number, cat: String, lang: String, notcat: String)`
    - `recentEpisodes(max: Number, excludeString: String, before: Number, fullText: Boolean)`
    - `recentNewFeeds(max: Number, since: Number)`
    - `recentSoundbites(max: Number)`
- Value
    - `valueByFeedUrl(feedUrl: String)`
    - `valueByFeedId(feedId: Number)`
- Categories
    - `categoriesList()`
- Notify Hub
    - `hubPubNotifyById(feedId: Number)`
    - `hubPubNotifyByUrl(feedUrl: String)`
- Add
    - `addByFeedUrl(feedUrl: String, chash: String, itunesId: Number)`
    - `addByItunesId(itunesId: Number)`

## Migrating to v2

v2.0.0 modernized the library. Breaking changes:

- **Node.js >= 22 is required.** The library now uses the built-in `fetch`; the `got` dependency was removed, so there are zero runtime dependencies.
- **A User-Agent is now required.** It used to be optional with a built-in default, but the API now blocks that default — pass your own as the third argument.
- **Errors are now `PodcastIndexError` instances** (still carrying `.code` and `.message`, now also `.body`). Existing code that catches errors and reads `err.code` / `err.message` keeps working.

See the [CHANGELOG](./CHANGELOG.md) for full details.

## License

[MIT](./license)

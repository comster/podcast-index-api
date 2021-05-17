# Podcast Index API Javascript library

> A Podcast Index API library for Node.js

[![pipeline status](https://gitlab.com/comster/podcast-index-api/badges/master/pipeline.svg)](https://gitlab.com/comster/podcast-index-api/-/commits/master)
[![coverage report](https://gitlab.com/comster/podcast-index-api/badges/master/coverage.svg)](https://gitlab.com/comster/podcast-index-api/-/commits/master)
[![Install size](https://packagephobia.now.sh/badge?p=podcast-index-api)](https://packagephobia.now.sh/result?p=podcast-index-api)
[![npm](https://img.shields.io/npm/v/podcast-index-api?style=plastic)](https://npmjs.com/podcast-index-api)
[![Downloads](https://img.shields.io/npm/dw/podcast-index-api.svg)](https://npmjs.com/podcast-index-api)

[Homepage](https://comster.github.io/podcast-index-api/) | [Source](https://github.com/comster/podcast-index-api) | [npm](https://npmjs.com/podcast-index-api)

## Installation

Install with npm

`npm install podcast-index-api --save`

## Configuration

Sign up for API credentials here: https://api.podcastindex.org/

Description of API endpoints, arguments and returned data: https://podcastindex-org.github.io/docs-api/

Require the lib from your javascript file

`const api = require('podcast-index-api')("YOUR_API_KEY_HERE", "YOUR_API_SECRET_HERE")`

## Usage

Using Async/Await

`const results = await api.searchByTerm('Joe Rogan Experience')`

Using Promise

`api.searchByTerm('Joe Rogan Experience').then(results => { console.log(results) })`

## Functions

-   Custom
    -   Use for endpoints that don't have a specific function or if the function doesn't accept an argument for a
        desired parameter.
        -   `custom(path: String, queries: Object)`
-   Search
    -   `searchByTerm(q: String, val: String, clean: Boolean, fullText: Boolean)`
    -   `searchEpisodesByPerson(q: String, fullText: Boolean)`
-   Podcasts
    -   `podcastsByFeedUrl(feedUrl: String)`
    -   `podcastsByFeedId(feedId: Number)`
    -   `podcastsByFeedItunesId(itunesId: Number)`
    -   `podcastsByTag()`
    -   `podcastsTrending(max: Number, since: Number, lang: String, cat: String, notcat: String)`
    -   `podcastsDead()`
-   Episodes
    -   `episodesByFeedId(feedId: Number, since: Number, max: Number, fullText: Boolean)`
    -   `episodesByFeedUrl(feedUrl: String, since: Number, max: Number, fullText: Boolean)`
    -   `episodesByItunesId(itunesId: Number, since: Number, max: Number, fullText: Boolean)`
    -   `episodesById(id: Number, fullText: Boolean)`
    -   `episodesRandom(max: Number, lang: String, cat: String, notcat: String, fullText: Boolean)`
-   Recent
    -   `recentFeeds(max: Number, since: Number, cat: String, lang: String, notcat: String)`
    -   `recentEpisodes(max: Number, excludeString: String, before: Number, fullText: Boolean)`
    -   `recentNewFeeds(max: Number, since: Number)`
    -   `recentSoundbites(max: Number)`
-   Value
    -   `valueByFeedUrl(feedUrl: String)`
    -   `valueByFeedId(feedId: Number)`
-   Stats
    -   `statsCurrent()`
-   Categories
    -   `categoriesList()`
-   Notify Hub
    -   `hubPubNotify(feedId: Number, update: Boolean)`
-   Add
    -   `addByFeedUrl(feedUrl: String, chash: String, itunesId: Number)`
    -   `addByItunesId(itunesId: Number)`

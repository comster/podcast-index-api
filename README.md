# Podcast Index API

> A Podcast Index API library for Node.js

![Build Status](https://gitlab.com/comster/podcast-index-api/badges/master/pipeline.svg?ignore_skipped=true)
![coverage](https://gitlab.com/comster/podcast-index-api/badges/master/coverage.svg?job=coverage)
[![Downloads](https://img.shields.io/npm/dm/podcast-index-api.svg)](https://npmjs.com/podcast-index-api)
[![Install size](https://packagephobia.now.sh/badge?p=podcast-index-api)](https://packagephobia.now.sh/result?p=podcast-index-api)


## Installation

Install with npm

`npm install podcast-index-api --save`


## Configuration

Sign up for API credentials here: https://api.podcastindex.org/

Require the lib from your javascript file

`const api = require('podcast-index-api')("YOUR_API_KEY_HERE", "YOUR_API_SECRET_HERE")`


## Usage

Using Async/Await

`const results = await api.searchByTerm(SEARCH_TERM)`

Using Promise

`api.searchByTerm(SEARCH_TERM).then(results => { console.log(results) })`


## Functions

- `searchByTerm(term: String)`
- `podcastsByFeedUrl(url: String)`
- `podcastsByFeedId(id: Number)`
- `podcastsByFeedItunesId(itunesId: Number)`
- `addByFeedUrl(url: String)`
- `episodesByFeedId(id: Number)`
- `episodesByFeedUrl(url: String)`
- `episodesByItunesId(itunesId: Number)`
- `recentEpisodes(max: Number, exclude: String)`

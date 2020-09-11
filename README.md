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

Require the lib from your javascript file

`const api = require('podcast-index-api')("YOUR_API_KEY_HERE", "YOUR_API_SECRET_HERE")`

## Usage

Using Async/Await

`const results = await api.searchByTerm('Joe Rogan Experience')`

Using Promise

`api.searchByTerm('Joe Rogan Experience').then(results => { console.log(results) })`

## Functions

-   `searchByTerm(term: String)`
-   `podcastsByFeedUrl(url: String)`
-   `podcastsByFeedId(id: Number)`
-   `podcastsByFeedItunesId(itunesId: Number)`
-   `addByFeedUrl(url: String)`
-   `episodesByFeedId(id: Number)`
-   `episodesByFeedUrl(url: String)`
-   `episodesByItunesId(itunesId: Number)`
-   `recentEpisodes(max: Number, exclude: String)`

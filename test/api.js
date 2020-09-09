const api = require('../index.js')(process.env.PODCASTINDEX_API_KEY, process.env.PODCASTINDEX_API_SECRET)

const SEARCH_TERM = 'Joe Rogan Experience'
const FEED_ID = 550168
const FEED_ITUNES_ID = 360084272
const FEED_TITLE = 'The Joe Rogan Experience'
const FEED_URL = 'http://joeroganexp.joerogan.libsynpro.com/rss'
const RECENT_EPISODES_COUNT = 3
const RECENT_EPISODES_EXCLUDE = 'news'

it('Search by term (async)', async () => {
    expect.assertions(5)
    const results = await api.searchByTerm(SEARCH_TERM)
    expect(results.feeds.length).toBeGreaterThan(0)
    expect(results).toHaveProperty('query', SEARCH_TERM);
    expect(results).toHaveProperty('feeds');
    expect(results.feeds[0].id).toEqual(FEED_ID)
    expect(results.feeds[0].title).toEqual(FEED_TITLE)
})

it('Search by term (promise)', async () => {
    expect.assertions(5)
    return api.searchByTerm(SEARCH_TERM).then(results => {
        expect(results.feeds.length).toBeGreaterThan(0)
        expect(results).toHaveProperty('query', SEARCH_TERM);
        expect(results).toHaveProperty('feeds');
        expect(results.feeds[0].id).toEqual(FEED_ID)
        expect(results.feeds[0].title).toEqual(FEED_TITLE)
    })
})

// it('Add feed by URL', async () => {
//     const results = await api.addByFeedUrl(FEED_URL)
//     console.log(results)
//     expect.assertions(1)
//     // expect(results.length).toBeGreaterThan(0)
// })

it('Episodes By Feed Id', async () => {
  expect.assertions(3)
  const results = await api.episodesByFeedId(FEED_ID)
  expect(results.items.length).toBeGreaterThan(0)
  expect(results).toHaveProperty('query', FEED_ID.toString());
  expect(results.items[0].feedId).toEqual(FEED_ID.toString())
})

it('Episodes By Feed URL', async () => {
  expect.assertions(3)
  const results = await api.episodesByFeedUrl(FEED_URL)
  expect(results.items.length).toBeGreaterThan(0)
  expect(results).toHaveProperty('query', FEED_URL);
  expect(results.items[0].feedId).toEqual(FEED_ID)
})

it('Episodes By Feed iTunes ID', async () => {
  expect.assertions(3)
  const results = await api.episodesByItunesId(FEED_ITUNES_ID)
  expect(results.items.length).toBeGreaterThan(0)
  expect(results).toHaveProperty('query', FEED_ITUNES_ID.toString());
  expect(results.items[0].feedId).toEqual(FEED_ID)
})

it('Podcasts By Feed URL', async () => {
  expect.assertions(3)
  const results = await api.podcastsByFeedUrl(FEED_URL)
  expect(results).toHaveProperty('query.url', FEED_URL);
  expect(results.feed.id).toEqual(FEED_ID)
  expect(results.feed.itunesId).toEqual(FEED_ITUNES_ID)
})

it('Podcasts By Feed ID', async () => {
  expect.assertions(3)
  const results = await api.podcastsByFeedId(FEED_ID)
  expect(results).toHaveProperty('query.id', FEED_ID.toString());
  expect(results.feed.id).toEqual(FEED_ID)
  expect(results.feed.itunesId).toEqual(FEED_ITUNES_ID)
})

it('Podcasts By Feed iTunes ID', async () => {
  expect.assertions(3)
  const results = await api.podcastsByFeedItunesId(FEED_ITUNES_ID)
  expect(results).toHaveProperty('query.id', FEED_ITUNES_ID.toString());
  expect(results.feed.id).toEqual(FEED_ID)
  expect(results.feed.itunesId).toEqual(FEED_ITUNES_ID)
})

it('Recent Episodes', async () => {
  expect.assertions(6)
  const results = await api.recentEpisodes(RECENT_EPISODES_COUNT, RECENT_EPISODES_EXCLUDE)
  expect(results).toHaveProperty('count', RECENT_EPISODES_COUNT);
  expect(results).toHaveProperty('max', RECENT_EPISODES_COUNT.toString());
  expect(results.items.length).toEqual(RECENT_EPISODES_COUNT)
  expect(results.items[0].title).toEqual(expect.not.stringContaining(RECENT_EPISODES_EXCLUDE))
  expect(results.items[1].title).toEqual(expect.not.stringContaining(RECENT_EPISODES_EXCLUDE))
  expect(results.items[2].title).toEqual(expect.not.stringContaining(RECENT_EPISODES_EXCLUDE))
})

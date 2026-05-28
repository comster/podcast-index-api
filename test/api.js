jest.setTimeout(10000)

const lib = require('../index.js')
const USER_AGENT = 'podcast-index-api/test'

// These tests hit the live Podcast Index API, so they only run when real
// credentials are present. Without them every test below is skipped (offline
// behavior is covered by test/unit.js), keeping the suite green in CI.
const hasCreds = !!(
    process.env.PODCASTINDEX_API_KEY && process.env.PODCASTINDEX_API_SECRET
)
const itLive = hasCreds ? it : it.skip
const api = hasCreds
    ? lib(
          process.env.PODCASTINDEX_API_KEY,
          process.env.PODCASTINDEX_API_SECRET,
          USER_AGENT,
      )
    : null

const SEARCH_TERM = 'The Joe Rogan Experience'
const SEARCH_PERSON = 'Joe Rogan'
const FEED_ID = 550168
const FEED_ID_VALUE = 920666
const FEED_ITUNES_ID = 360084272
const FEED_TITLE = 'The Joe Rogan Experience'
const FEED_URL = 'http://joeroganexp.joerogan.libsynpro.com/rss'
const FEED_URL_NOT_FOUND = 'http://www.google.com/'
const FEED_URL_VALUE = 'https://mp3s.nashownotes.com/pc20rss.xml'
const EPISODE_ID = 16795090
const RECENT_FEEDS_COUNT = 3
const RECENT_EPISODES_COUNT = 3
const RECENT_EPISODES_EXCLUDE = 'news'
const FEED_GUID = '9d783600-a77f-5c77-9042-0d9f3280465e'

itLive('Custom', async () => {
    expect.assertions(4)
    const results = await api.custom('search/byterm', {
        q: SEARCH_TERM,
    })
    expect(results.status).toEqual('true')
    expect(results.feeds.length).toBeGreaterThan(0)
    expect(results).toHaveProperty('query', SEARCH_TERM)
    expect(results).toHaveProperty('feeds')
})

itLive('Search by term (async)', async () => {
    expect.assertions(4)
    const results = await api.searchByTerm(SEARCH_TERM)
    expect(results.status).toEqual('true')
    expect(results.feeds.length).toBeGreaterThan(0)
    expect(results).toHaveProperty('query', SEARCH_TERM)
    expect(results).toHaveProperty('feeds')
    // expect(results.feeds[0].id).toEqual(FEED_ID)
    // expect(results.feeds[0].title).toEqual(FEED_TITLE)
})

itLive('Search by term (promise)', async () => {
    expect.assertions(4)
    return api.searchByTerm(SEARCH_TERM).then((results) => {
        expect(results.status).toEqual('true')
        expect(results.feeds.length).toBeGreaterThan(0)
        expect(results).toHaveProperty('query', SEARCH_TERM)
        expect(results).toHaveProperty('feeds')
        // expect(results.feeds[0].id).toEqual(FEED_ID)
        // expect(results.feeds[0].title).toEqual(FEED_TITLE)
    })
})

itLive('Search by term (value)', async () => {
    expect.assertions(4)
    const searchTerm = 'no agenda'
    const results = await api.searchByTerm(searchTerm, 'lightning')
    expect(results.status).toEqual('true')
    expect(results.feeds.length).toBeGreaterThan(0)
    expect(results).toHaveProperty('query', searchTerm)
    expect(results).toHaveProperty('feeds')
    // expect(results.feeds[0].id).toEqual(FEED_ID)
    // expect(results.feeds[0].title).toEqual(FEED_TITLE)
})

itLive('Search by title', async () => {
    expect.assertions(6)
    const results = await api.searchByTitle(FEED_TITLE)
    expect(results.status).toEqual('true')
    expect(results.feeds.length).toBeGreaterThan(0)
    expect(results).toHaveProperty('query', FEED_TITLE)
    expect(results).toHaveProperty('feeds')
    expect(results.feeds[0].id).toEqual(FEED_ID)
    expect(results.feeds[0].title).toEqual(FEED_TITLE)
})

itLive('Search episodes by person', async () => {
    expect.assertions(4)
    const results = await api.searchEpisodesByPerson(SEARCH_PERSON)
    expect(results.status).toEqual('true')
    expect(results.items.length).toBeGreaterThan(0)
    expect(results).toHaveProperty('query', SEARCH_PERSON)
    expect(results).toHaveProperty('items')
})

// it('Add feed by URL', async () => {
//     const results = await api.addByFeedUrl(FEED_URL)
//     expect.assertions(1)
//     expect(results.status).toEqual('true')
// })

// it('Add feed by iTunes ID', async () => {
//     const results = await api.addByItunesId(FEED_ITUNES_ID)
//     console.log(results)
//     expect.assertions(1)
//     expect(results.status).toEqual('true')
// })

itLive('Episodes By Feed Id', async () => {
    expect.assertions(2)
    const results = await api.episodesByFeedId(FEED_ID)
    // console.log(results)
    expect(results.items.length).toBeGreaterThan(0)
    expect(results).toHaveProperty('query', FEED_ID.toString())
    // expect(results.items[0].feedId).toEqual(FEED_ID.toString()) // TODO is it feedid or feedId?
})

itLive('Episodes By Feed URL', async () => {
    expect.assertions(3)
    const results = await api.episodesByFeedUrl(FEED_URL)
    expect(results.items.length).toBeGreaterThan(0)
    expect(results).toHaveProperty('query', FEED_URL)
    expect(results.items[0].feedId).toEqual(FEED_ID)
})

itLive('Episodes By Feed iTunes ID', async () => {
    expect.assertions(3)
    const results = await api.episodesByItunesId(FEED_ITUNES_ID)
    expect(results.items.length).toBeGreaterThan(0)
    // iTunes-ID lookups echo the query id back as a number (feed-ID lookups return a string)
    expect(results).toHaveProperty('query', FEED_ITUNES_ID)
    expect(results.items[0].feedId).toEqual(FEED_ID)
})

itLive('Episodes By ID', async () => {
    expect.assertions(1)
    const results = await api.episodesById(EPISODE_ID)
    // expect(results).toHaveProperty('query', EPISODE_ID.toString())
    expect(results.episode.id).toEqual(EPISODE_ID)
})

itLive('Episodes random', async () => {
    expect.assertions(2)
    const results = await api.episodesRandom(2)
    // expect(results).toHaveProperty('query', EPISODE_ID.toString())
    expect(results.count).toEqual(2)
    expect(results.episodes.length).toEqual(2)
})

itLive('Podcasts By Feed URL', async () => {
    expect.assertions(3)
    const results = await api.podcastsByFeedUrl(FEED_URL)
    expect(results).toHaveProperty('query.url', FEED_URL)
    expect(results.feed.id).toEqual(FEED_ID)
    expect(results.feed.itunesId).toEqual(FEED_ITUNES_ID)
})

itLive('Podcasts By Feed URL not found', async () => {
    expect.assertions(1)
    try {
        const results = await api.podcastsByFeedUrl(FEED_URL_NOT_FOUND)
    } catch (e) {
        expect(e.code).toEqual(400)
    }
})

itLive('Podcasts By Feed ID', async () => {
    expect.assertions(3)
    const results = await api.podcastsByFeedId(FEED_ID)
    expect(results).toHaveProperty('query.id', FEED_ID.toString())
    expect(results.feed.id).toEqual(FEED_ID)
    expect(results.feed.itunesId).toEqual(FEED_ITUNES_ID)
})

itLive('Podcasts By Feed iTunes ID', async () => {
    expect.assertions(3)
    const results = await api.podcastsByFeedItunesId(FEED_ITUNES_ID)
    // iTunes-ID lookups echo the query id back as a number (feed-ID lookups return a string)
    expect(results).toHaveProperty('query.id', FEED_ITUNES_ID)
    expect(results.feed.id).toEqual(FEED_ID)
    expect(results.feed.itunesId).toEqual(FEED_ITUNES_ID)
})

itLive('Podcasts By GUID', async () => {
    expect.assertions(3)
    const results = await api.podcastsByGUID(FEED_GUID)
    expect(results).toHaveProperty('query.id', FEED_ID)
    expect(results.feed.id).toEqual(FEED_ID)
    expect(results.feed.itunesId).toEqual(FEED_ITUNES_ID)
})

itLive('Podcasts By tag', async () => {
    expect.assertions(3)
    const results = await api.podcastsByTag()
    expect(results.status).toEqual('true')
    expect(results.feeds.length).toBeGreaterThan(1)
    expect(results.count).toBeGreaterThan(1)
})

itLive('Podcasts trending', async () => {
    expect.assertions(3)
    const results = await api.podcastsTrending()
    expect(results.status).toEqual('true')
    expect(results.feeds.length).toEqual(10)
    expect(results.count).toEqual(10)
})

itLive('Podcasts dead', async () => {
    expect.assertions(3)
    const results = await api.podcastsDead()
    expect(results.status).toEqual('true')
    expect(results.feeds.length).toBeGreaterThan(1)
    expect(results.count).toBeGreaterThan(1)
})

itLive('Recent Feeds', async () => {
    expect.assertions(1)
    const results = await api.recentFeeds(RECENT_FEEDS_COUNT, null, 'news')
    // console.log(results)
    // expect(results).toHaveProperty('count', RECENT_FEEDS_COUNT)
    // expect(results).toHaveProperty('max', RECENT_FEEDS_COUNT.toString())
    expect(results.feeds.length).toEqual(RECENT_FEEDS_COUNT)
})

itLive('Recent Feeds in language', async () => {
    expect.assertions(2)
    const results = await api.recentFeeds(RECENT_FEEDS_COUNT, null, null, 'ja')
    // console.log(results)
    // expect(results).toHaveProperty('count', RECENT_FEEDS_COUNT)
    // expect(results).toHaveProperty('max', RECENT_FEEDS_COUNT.toString())
    expect(results.feeds.length).toEqual(RECENT_FEEDS_COUNT)
    expect(results.feeds[0].language).toEqual('ja')
})

itLive('Recent Episodes', async () => {
    expect.assertions(3)
    const results = await api.recentEpisodes(RECENT_FEEDS_COUNT)
    expect(results).toHaveProperty('count', RECENT_FEEDS_COUNT)
    expect(results).toHaveProperty('max', RECENT_FEEDS_COUNT.toString())
    expect(results.items.length).toEqual(RECENT_FEEDS_COUNT)
})

itLive('Recent Episodes', async () => {
    expect.assertions(6)
    const results = await api.recentEpisodes(
        RECENT_EPISODES_COUNT,
        RECENT_EPISODES_EXCLUDE,
    )
    expect(results).toHaveProperty('count', RECENT_EPISODES_COUNT)
    expect(results).toHaveProperty('max', RECENT_EPISODES_COUNT.toString())
    expect(results.items.length).toEqual(RECENT_EPISODES_COUNT)
    expect(results.items[0].title).toEqual(
        expect.not.stringContaining(RECENT_EPISODES_EXCLUDE),
    )
    expect(results.items[1].title).toEqual(
        expect.not.stringContaining(RECENT_EPISODES_EXCLUDE),
    )
    expect(results.items[2].title).toEqual(
        expect.not.stringContaining(RECENT_EPISODES_EXCLUDE),
    )
})

itLive('Recent New Feeds', async () => {
    expect.assertions(1)
    const results = await api.recentNewFeeds()
    // recent/newfeeds returns status as a boolean, unlike other endpoints
    expect(results).toHaveProperty('status', true)
})

itLive('Recent soundbites', async () => {
    expect.assertions(3)
    const results = await api.recentSoundbites(20)
    expect(results).toHaveProperty('status', 'true')
    expect(results.items.length).toBeGreaterThan(1)
    expect(results.count).toBeGreaterThan(1)
})

itLive('Value By Feed URL', async () => {
    expect.assertions(2)
    const results = await api.valueByFeedUrl(FEED_URL_VALUE)
    expect(results).toHaveProperty('query.url', FEED_URL_VALUE)
    expect(results).toHaveProperty('value')
})

itLive('Value By Feed ID', async () => {
    expect.assertions(2)
    const results = await api.valueByFeedId(FEED_ID_VALUE)
    expect(results).toHaveProperty('query.id', FEED_ID_VALUE.toString())
    expect(results).toHaveProperty('value')
})

itLive('Categories list', async () => {
    expect.assertions(5)
    const results = await api.categoriesList()
    expect(results).toHaveProperty('status', 'true')
    expect(results.feeds.length).toBeGreaterThan(10)
    expect(results.count).toBeGreaterThan(10)
    expect(results.feeds[0]).toHaveProperty('id', 1)
    expect(results.feeds[0]).toHaveProperty('name', 'Arts')
})

// it('Hub pun notify', async () => {
//     expect.assertions(2)
//     const results = await api.hubPubNotify(75075)
//     expect(results).toHaveProperty('status', 'true')
//     expect(results).toHaveProperty('description', 'Feed marked for immediate update.')
// })

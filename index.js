const got = require('got')
const crypto = require('crypto')
const querystring = require('querystring')

//
// https://api.podcastindex.org/developer_docs
// updated: https://podcastindex-org.github.io/docs-api/
//

const BASE_API_URL = 'https://api.podcastindex.org/api/1.0/'

const PATH_SEARCH_BY_TERM = 'search/byterm'
const PATH_ADD_BY_FEED_URL = 'add/byfeedurl'
const PATH_ADD_BY_ITUNES_ID = 'add/byitunesid'
const PATH_EPISODES_BY_FEED_ID = 'episodes/byfeedid'
const PATH_EPISODES_BY_FEED_URL = 'episodes/byfeedurl'
const PATH_EPISODES_BY_ITUNES_ID = 'episodes/byitunesid'
const PATH_EPISODES_BY_ID = 'episodes/byid'
const PATH_EPISODES_RANDOM = 'episodes/random'
const PATH_PODCASTS_BY_FEED_URL = 'podcasts/byfeedurl'
const PATH_PODCASTS_BY_FEED_ID = 'podcasts/byfeedid'
const PATH_PODCASTS_BY_ITUNES_ID = 'podcasts/byitunesid'
const PATH_RECENT_FEEDS = 'recent/feeds'
const PATH_RECENT_EPISODES = 'recent/episodes'
const PATH_RECENT_NEWFEEDS = 'recent/newfeeds'
const PATH_STATS_CURRENT = 'stats/current'

const qs = (o) => '?' + querystring.stringify(o)

const withResponse = (response) => {
    // Check for success or failure and create a predictable error response
    let body = response.body
    // if response.statusCode == 200?
    if (
        response.statusCode == 500 ||
        (body.hasOwnProperty('status') && body.status === 'false')
    ) {
        // Failed
        if (body.hasOwnProperty('description')) {
            // Error message from server API
            throw { message: body.description, code: response.statusCode }
        } else {
            throw { message: 'Request failed.', code: response.statusCode }
        }
    } else {
        // Succcess // 200
        return body
    }
}

module.exports = (key, secret, userAgent) => {
    if (!key || !secret) {
        throw new Error(
            'API Key and Secret are required from https://api.podcastindex.org/'
        )
    }

    const api = got.extend({
        responseType: 'json',
        prefixUrl: BASE_API_URL,
        throwHttpErrors: false,
        hooks: {
            beforeRequest: [
                (options) => {
                    let dt = new Date().getTime() / 1000
                    options.headers['User-Agent'] =
                        userAgent ||
                        'PodcastIndexBot/@podcast@noagendasocial.com'
                    options.headers['X-Auth-Date'] = dt
                    options.headers['X-Auth-Key'] = key
                    options.headers['Authorization'] = crypto
                        .createHash('sha1')
                        .update(key + secret + dt)
                        .digest('hex')
                },
            ],
        },
    })

    return {
        api,
        searchByTerm: async (q) => {
            const response = await api(PATH_SEARCH_BY_TERM + qs({ q: q }))
            return withResponse(response)
        },
        podcastsByFeedUrl: async (feedUrl) => {
            const response = await api(
                PATH_PODCASTS_BY_FEED_URL + qs({ url: feedUrl })
            )
            return withResponse(response)
        },
        podcastsByFeedId: async (feedId) => {
            const response = await api(
                PATH_PODCASTS_BY_FEED_ID + qs({ id: feedId })
            )
            return withResponse(response)
        },
        podcastsByFeedItunesId: async (itunesId) => {
            const response = await api(
                PATH_PODCASTS_BY_ITUNES_ID + qs({ id: itunesId })
            )
            return withResponse(response)
        },
        addByFeedUrl: async (feedUrl) => {
            const response = await api(
                PATH_ADD_BY_FEED_URL + qs({ url: feedUrl })
            )
            return withResponse(response)
        },
        addByItunesId: async (itunesId) => {
            const response = await api(
                PATH_ADD_BY_ITUNES_ID + qs({ id: itunesId })
            )
            return withResponse(response)
        },
        episodesByFeedId: async (feedId) => {
            const response = await api(
                PATH_EPISODES_BY_FEED_ID + qs({ id: feedId })
            )
            return withResponse(response)
        },
        episodesByFeedUrl: async (feedUrl) => {
            const response = await api(
                PATH_EPISODES_BY_FEED_URL + qs({ url: feedUrl })
            )
            return withResponse(response)
        },
        episodesByItunesId: async (itunesId) => {
            const response = await api(
                PATH_EPISODES_BY_ITUNES_ID + qs({ id: itunesId })
            )
            return withResponse(response)
        },
        episodesById: async (id) => {
            const response = await api(PATH_EPISODES_BY_ID + qs({ id: id }))
            return withResponse(response)
        },
        episodesRandom: async (max = 1) => {
            const response = await api(PATH_EPISODES_RANDOM + qs({ max: max }))
            return withResponse(response)
        },
        recentFeeds: async (
            max = 40,
            since = null,
            cat = null,
            lang = null
        ) => {
            const response = await api(
                PATH_RECENT_FEEDS +
                    qs({
                        max: max,
                        since: since,
                        cat: cat,
                        lang: lang,
                    })
            )
            return withResponse(response)
        },
        recentEpisodes: async (
            max = 10,
            excludeString = null,
            excludeBlank = null
        ) => {
            const response = await api(
                PATH_RECENT_EPISODES +
                    qs({
                        max: max,
                        excludeString: excludeString ? excludeString : null,
                        excludeBlank: excludeBlank ? excludeBlank : null,
                    })
            )
            return withResponse(response)
        },
        recentNewFeeds: async () => {
            const response = await api(PATH_RECENT_NEWFEEDS)
            return withResponse(response)
        },
        statsCurrent: async () => {
            const response = await api(PATH_STATS_CURRENT)
            return withResponse(response)
        },
    }
}

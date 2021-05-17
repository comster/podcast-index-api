const got = require('got')
const crypto = require('crypto')
const querystring = require('querystring')

//
// API docs: https://podcastindex-org.github.io/docs-api/#get-/search/byterm
//

const BASE_API_URL = 'https://api.podcastindex.org/api/1.0/'

const PATH_SEARCH_BY_TERM = 'search/byterm'
const PATH_SEARCH_EPISODE_BY_PERSON = 'search/byperson'
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
const PATH_PODCASTS_BY_TAG = 'podcasts/bytag'
const PATH_PODCASTS_TRENDING = 'podcasts/trending'
const PATH_PODCASTS_DEAD = 'podcasts/dead'
const PATH_RECENT_FEEDS = 'recent/feeds'
const PATH_RECENT_EPISODES = 'recent/episodes'
const PATH_RECENT_NEWFEEDS = 'recent/newfeeds'
const PATH_RECENT_SOUNDBITES = 'recent/soundbites'
const PATH_VALUE_BY_FEED_ID = 'value/byfeedid'
const PATH_VALUE_BY_FEED_URL = 'value/byfeedurl'
const PATH_STATS_CURRENT = 'stats/current'
const PATH_CATEGORIES_LIST = 'categories/list'
const PATH_HUB_PUBNOTIFIY = 'hub/pubnotify'

const qs = (o) => '?' + querystring.stringify(o)

const withResponse = (response) => {
    // Check for success or failure and create a predictable error response
    let body = response.body
    // if response.statusCode == 200?
    if (
        response.statusCode === 500 ||
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

    const custom = async (path, queries) => {
        const response = await api(path + qs(queries))
        return withResponse(response)
    }

    return {
        api,
        custom,

        searchByTerm: async (q, val = '', clean = false, fullText = false) => {
            let queries = {
                q: q,
            }
            if (val !== '') queries['val'] = val
            if (clean) queries['clean'] = ''
            if (fullText) queries['fullText'] = ''
            return custom(PATH_SEARCH_BY_TERM, queries)
        },
        searchEpisodesByPerson: async (q, fullText = false) => {
            let queries = {
                q: q,
            }
            if (fullText) queries['fullText'] = ''
            return custom(PATH_SEARCH_EPISODE_BY_PERSON, queries)
        },

        podcastsByFeedUrl: async (feedUrl) => {
            return custom(PATH_PODCASTS_BY_FEED_URL, { url: feedUrl })
        },
        podcastsByFeedId: async (feedId) => {
            return custom(PATH_PODCASTS_BY_FEED_ID, { id: feedId })
        },
        podcastsByFeedItunesId: async (itunesId) => {
            return custom(PATH_PODCASTS_BY_ITUNES_ID, { id: itunesId })
        },
        podcastsByTag: async () => {
            return custom(PATH_PODCASTS_BY_TAG, { 'podcast-value': '' })
        },
        podcastsTrending: async (
            max = 10,
            since = null,
            lang = null,
            cat = null,
            notcat = null
        ) => {
            return custom(PATH_PODCASTS_TRENDING, {
                max: max,
                since: since,
                lang: lang,
                cat: cat,
                notcat: notcat,
            })
        },
        podcastsDead: async () => {
            return custom(PATH_PODCASTS_DEAD)
        },

        addByFeedUrl: async (feedUrl, chash = null, itunesId = null) => {
            return custom(PATH_ADD_BY_FEED_URL, {
                url: feedUrl,
                chash: chash,
                itunesid: itunesId,
            })
        },
        addByItunesId: async (itunesId) => {
            return custom(PATH_ADD_BY_ITUNES_ID, { id: itunesId })
        },

        episodesByFeedId: async (
            feedId,
            since = null,
            max = 10,
            fullText = false
        ) => {
            let queries = {
                id: feedId,
                since: since,
                max: max,
            }
            if (fullText) queries['fullText'] = ''
            return custom(PATH_EPISODES_BY_FEED_ID, queries)
        },
        episodesByFeedUrl: async (
            feedUrl,
            since = null,
            max = 10,
            fullText = false
        ) => {
            let queries = {
                url: feedUrl,
                since: since,
                max: max,
            }
            if (fullText) queries['fullText'] = ''
            return custom(PATH_EPISODES_BY_FEED_URL, queries)
        },
        episodesByItunesId: async (
            itunesId,
            since = null,
            max = 10,
            fullText = false
        ) => {
            let queries = {
                id: itunesId,
                since: since,
                max: max,
            }
            if (fullText) queries['fullText'] = ''
            return custom(PATH_EPISODES_BY_ITUNES_ID, queries)
        },
        episodesById: async (id, fullText = false) => {
            let queries = {
                id: id,
            }
            if (fullText) queries['fullText'] = ''
            return custom(PATH_EPISODES_BY_ID, queries)
        },
        episodesRandom: async (
            max = 1,
            lang = null,
            cat = null,
            notcat = null,
            fullText = false
        ) => {
            let queries = {
                max: max,
                lang: lang,
                cat: cat,
                notcat: notcat,
            }
            if (fullText) queries['fullText'] = ''
            return custom(PATH_EPISODES_RANDOM, queries)
        },

        recentFeeds: async (
            max = 40,
            since = null,
            cat = null,
            lang = null,
            notcat = null
        ) => {
            return custom(PATH_RECENT_FEEDS, {
                max: max,
                since: since,
                lang: lang,
                cat: cat,
                notcat: notcat,
            })
        },
        recentEpisodes: async (
            max = 10,
            excludeString = null,
            before = null,
            fullText = false
        ) => {
            let queries = {
                max: max,
                excludeString: excludeString ? excludeString : null,
                before: before,
            }
            if (fullText) queries['fullText'] = ''
            return custom(PATH_RECENT_EPISODES, queries)
        },
        recentNewFeeds: async (max = 20, since = null) => {
            return custom(PATH_RECENT_NEWFEEDS, {
                max: max,
                since: since,
            })
        },
        recentSoundbites: async (max = 20) => {
            return custom(PATH_RECENT_SOUNDBITES, {
                max: max,
            })
        },

        valueByFeedId: async (feedId) => {
            return custom(PATH_VALUE_BY_FEED_ID, {
                id: feedId,
            })
        },
        valueByFeedUrl: async (feedUrl) => {
            return custom(PATH_VALUE_BY_FEED_URL, {
                url: feedUrl,
            })
        },

        statsCurrent: async () => {
            return custom(PATH_STATS_CURRENT)
        },

        categoriesList: async () => {
            return custom(PATH_CATEGORIES_LIST)
        },

        hubPubNotify: async (feedId, update = true) => {
            let queries = {
                id: feedId,
            }
            if (update) queries['update'] = ''
            return custom(PATH_HUB_PUBNOTIFIY, queries)
        },
    }
}

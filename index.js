const crypto = require('crypto')
const querystring = require('querystring')

//
// API docs: https://podcastindex-org.github.io/docs-api/#get-/search/byterm
//

// Error thrown for a failed API request. Carries the HTTP `code` and, when the
// server returned a JSON error payload, the parsed `body`.
class PodcastIndexError extends Error {
    constructor(message, code, body) {
        super(message)
        this.name = 'PodcastIndexError'
        this.code = code
        this.body = body
    }
}

const BASE_API_URL = 'https://api.podcastindex.org/api/1.0/'

const PATH_SEARCH_BY_TERM = 'search/byterm'
const PATH_SEARCH_BY_TITLE = 'search/bytitle'
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
const PATH_PODCASTS_BY_GUID = 'podcasts/byguid'
const PATH_PODCASTS_BY_TAG = 'podcasts/bytag'
const PATH_PODCASTS_TRENDING = 'podcasts/trending'
const PATH_PODCASTS_DEAD = 'podcasts/dead'
const PATH_RECENT_FEEDS = 'recent/feeds'
const PATH_RECENT_EPISODES = 'recent/episodes'
const PATH_RECENT_NEWFEEDS = 'recent/newfeeds'
const PATH_RECENT_SOUNDBITES = 'recent/soundbites'
const PATH_VALUE_BY_FEED_ID = 'value/byfeedid'
const PATH_VALUE_BY_FEED_URL = 'value/byfeedurl'
const PATH_CATEGORIES_LIST = 'categories/list'
const PATH_HUB_PUBNOTIFIY = 'hub/pubnotify'

const qs = (o) => {
    // Drop null/undefined values (callers pass them for unset optional params)
    // but keep empty strings, which the API uses as presence flags (fullText).
    const params = {}
    for (const [k, v] of Object.entries(o || {})) {
        if (v !== null && v !== undefined) params[k] = v
    }
    return '?' + querystring.stringify(params)
}

const withResponse = (response) => {
    // Check for success or failure and surface a predictable error
    const body = response.body
    if (
        response.statusCode === 500 ||
        (body.hasOwnProperty('status') && body.status === 'false')
    ) {
        // Use the server's error description when present
        const message = body.hasOwnProperty('description')
            ? body.description
            : 'Request failed.'
        throw new PodcastIndexError(message, response.statusCode, body)
    }
    // Success // 200
    return body
}

module.exports = (key, secret, userAgent) => {
    // A User-Agent is required: the API rejects requests with a missing or
    // generic/sample User-Agent, so callers must supply their own.
    if (!key || !secret || !userAgent) {
        throw new Error(
            'API Key, Secret, and User-Agent are required from https://api.podcastindex.org/',
        )
    }

    // Signed request against the API using the built-in fetch (Node >=22).
    // Returns { statusCode, body } so withResponse() can stay unchanged.
    const api = async (path) => {
        const dt = new Date().getTime() / 1000
        const response = await fetch(BASE_API_URL + path, {
            headers: {
                'User-Agent': userAgent,
                'X-Auth-Date': String(dt),
                'X-Auth-Key': key,
                Authorization: crypto
                    .createHash('sha1')
                    .update(key + secret + dt)
                    .digest('hex'),
            },
        })
        // Auth/WAF errors come back as plain text or HTML, so fall back to a
        // predictable { message, code } error when the body isn't JSON.
        const text = await response.text()
        try {
            return { statusCode: response.status, body: JSON.parse(text) }
        } catch (err) {
            throw new PodcastIndexError(
                text || 'Request failed.',
                response.status,
            )
        }
    }

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
        searchByTitle: async (q, val = '', clean = false, fullText = false) => {
            let queries = {
                q: q,
            }
            if (val !== '') queries['val'] = val
            if (clean) queries['clean'] = ''
            if (fullText) queries['fullText'] = ''
            return custom(PATH_SEARCH_BY_TITLE, queries)
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
        podcastsByGUID: async (guid) => {
            return custom(PATH_PODCASTS_BY_GUID, { guid: guid })
        },
        podcastsByTag: async () => {
            return custom(PATH_PODCASTS_BY_TAG, { 'podcast-value': '' })
        },
        podcastsTrending: async (
            max = 10,
            since = null,
            lang = null,
            cat = null,
            notcat = null,
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
            fullText = false,
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
            fullText = false,
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
            fullText = false,
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
            fullText = false,
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
            notcat = null,
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
            fullText = false,
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

        categoriesList: async () => {
            return custom(PATH_CATEGORIES_LIST)
        },

        hubPubNotifyById: async (feedId) => {
            let queries = {
                id: feedId,
            }
            return custom(PATH_HUB_PUBNOTIFIY, queries)
        },
        hubPubNotifyByUrl: async (feedUrl) => {
            let queries = {
                url: feedUrl,
            }
            return custom(PATH_HUB_PUBNOTIFIY, queries)
        },
    }
}

// Exposed so consumers can do `catch (e) { if (e instanceof PodcastIndexError) ... }`
module.exports.PodcastIndexError = PodcastIndexError

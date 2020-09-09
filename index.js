const got = require('got')
const crypto = require('crypto')

const BASE_API_URL = 'https://api.podcastindex.org/api/1.0/'

const PATH_SEARCH_BY_TERM = 'search/byterm'

const PATH_PODCASTS_BY_FEED_URL = 'podcasts/byfeedurl'
const PATH_PODCASTS_BY_FEED_ID = 'podcasts/byfeedid'
const PATH_PODCASTS_BY_ITUNES_ID = 'podcasts/byitunesid'
const PATH_ADD_BY_FEED_URL = 'add/byfeedurl'

const PATH_EPISODES_BY_FEED_ID = 'episodes/byfeedid'
const PATH_EPISODES_BY_FEED_URL = 'episodes/byfeedurl'
const PATH_EPISODES_BY_ITUNES_ID = 'episodes/byitunesid'

const PATH_RECENT_EPISODES = 'recent/episodes'

// https://api.podcastindex.org/developer_docs

const withResponse = response => response.body

module.exports = (key, secret, userAgent) => {
    if(!key || !secret) {
        throw new Error("API Key and Secret are required from https://api.podcastindex.org/")
    }
    const api = got.extend({
        responseType: 'json',
        prefixUrl: BASE_API_URL,
    	hooks: {
    		beforeRequest: [
    			options => {
    			    let dt = new Date().getTime() / 1000
    			    options.headers["User-Agent"] = userAgent || "PodcastIndexBot/@podcast@noagendasocial.com"
    			    options.headers["X-Auth-Date"] = dt
    			    options.headers["X-Auth-Key"] = key
    				options.headers["Authorization"] = 
    				    crypto
    				        .createHash("sha1")
    				        .update(key+secret+dt)
    				        .digest("hex")
    			}
    		]
    	}
    })
    
    const podcastsByFeedUrl = async feedUrl => {
        const response = await api(PATH_PODCASTS_BY_FEED_URL+'?url='+feedUrl)
        return withResponse(response)
    }
    
    const podcastsByFeedId = async feedId => {
        const response = await api(PATH_PODCASTS_BY_FEED_ID+'?id='+feedId)
        return withResponse(response)
    }
    
    const podcastsByFeedItunesId = async itunesId => {
        const response = await api(PATH_PODCASTS_BY_ITUNES_ID+'?id='+itunesId)
        return withResponse(response)
    }
    
    const addByFeedUrl = async feedUrl => {
        const response = await api(PATH_ADD_BY_FEED_URL+'?url='+feedUrl)
        console.log(response)
    	return withResponse(response)
    }

    const searchByTerm = async q => {
        const response = await api(PATH_SEARCH_BY_TERM+'?q='+q.split(" ").join("+"))
    	return withResponse(response)
    }
    
    const episodesByFeedId = async feedId => {
        const response = await api(PATH_EPISODES_BY_FEED_ID+'?id='+feedId)
    	return withResponse(response)
    }
    
    const episodesByFeedUrl = async feedUrl => {
        const response = await api(PATH_EPISODES_BY_FEED_URL+'?url='+feedUrl)
    	return withResponse(response)
    }
    
    const episodesByItunesId = async itunesId => {
        const response = await api(PATH_EPISODES_BY_ITUNES_ID+'?id='+itunesId)
    	return withResponse(response)
    }
    
    const recentEpisodes = async (max = 10, excludeString=null) => {
        const response = await api(PATH_RECENT_EPISODES+'?max='+max+(excludeString ? '&excludeString='+encodeURIComponent(excludeString) : ''))
    	return withResponse(response)
    }
    
    return {
        api,
        podcastsByFeedUrl,
        podcastsByFeedId,
        podcastsByFeedItunesId,
        addByFeedUrl,
        searchByTerm,
        episodesByFeedId,
        episodesByFeedUrl,
        episodesByItunesId,
        recentEpisodes
    }
}
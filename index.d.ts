// Type definitions for podcast-index-api 2.0.0
// Project: https://github.com/comster/podcast-index-api
//
// The factory returns an object of API methods. Endpoints resolve to the raw
// JSON returned by the Podcast Index API; see the official docs for response
// shapes: https://podcastindex-org.github.io/docs-api/

declare function podcastIndexApi(
    key: string,
    secret: string,
    userAgent: string,
): podcastIndexApi.PodcastIndexApi

declare namespace podcastIndexApi {
    /** Raw JSON body returned by an endpoint. See the Podcast Index API docs. */
    type PodcastIndexResponse = any

    /** Error thrown for a failed API request. */
    class PodcastIndexError extends Error {
        name: 'PodcastIndexError'
        /** HTTP status code of the failed response. */
        code?: number
        /** Parsed JSON error payload from the API, when available. */
        body?: any
        constructor(message: string, code?: number, body?: any)
    }

    interface PodcastIndexApi {
        /**
         * Low-level signed request. Unlike the named methods it does NOT throw
         * on API errors — it resolves with the raw status code and parsed body.
         */
        api(path: string): Promise<{ statusCode: number; body: any }>

        /** Call an arbitrary endpoint path with a query object. */
        custom(
            path: string,
            queries?: Record<string, unknown>,
        ): Promise<PodcastIndexResponse>

        // Search
        searchByTerm(
            q: string,
            val?: string,
            clean?: boolean,
            fullText?: boolean,
        ): Promise<PodcastIndexResponse>
        searchByTitle(
            q: string,
            val?: string,
            clean?: boolean,
            fullText?: boolean,
        ): Promise<PodcastIndexResponse>
        searchEpisodesByPerson(
            q: string,
            fullText?: boolean,
        ): Promise<PodcastIndexResponse>

        // Podcasts
        podcastsByFeedUrl(feedUrl: string): Promise<PodcastIndexResponse>
        podcastsByFeedId(feedId: number): Promise<PodcastIndexResponse>
        podcastsByFeedItunesId(itunesId: number): Promise<PodcastIndexResponse>
        podcastsByGUID(guid: string): Promise<PodcastIndexResponse>
        podcastsByTag(): Promise<PodcastIndexResponse>
        podcastsTrending(
            max?: number,
            since?: number | null,
            lang?: string | null,
            cat?: string | null,
            notcat?: string | null,
        ): Promise<PodcastIndexResponse>
        podcastsDead(): Promise<PodcastIndexResponse>

        // Add
        addByFeedUrl(
            feedUrl: string,
            chash?: string | null,
            itunesId?: number | null,
        ): Promise<PodcastIndexResponse>
        addByItunesId(itunesId: number): Promise<PodcastIndexResponse>

        // Episodes
        episodesByFeedId(
            feedId: number,
            since?: number | null,
            max?: number,
            fullText?: boolean,
        ): Promise<PodcastIndexResponse>
        episodesByFeedUrl(
            feedUrl: string,
            since?: number | null,
            max?: number,
            fullText?: boolean,
        ): Promise<PodcastIndexResponse>
        episodesByItunesId(
            itunesId: number,
            since?: number | null,
            max?: number,
            fullText?: boolean,
        ): Promise<PodcastIndexResponse>
        episodesById(
            id: number,
            fullText?: boolean,
        ): Promise<PodcastIndexResponse>
        episodesRandom(
            max?: number,
            lang?: string | null,
            cat?: string | null,
            notcat?: string | null,
            fullText?: boolean,
        ): Promise<PodcastIndexResponse>

        // Recent
        recentFeeds(
            max?: number,
            since?: number | null,
            cat?: string | null,
            lang?: string | null,
            notcat?: string | null,
        ): Promise<PodcastIndexResponse>
        recentEpisodes(
            max?: number,
            excludeString?: string | null,
            before?: number | null,
            fullText?: boolean,
        ): Promise<PodcastIndexResponse>
        recentNewFeeds(
            max?: number,
            since?: number | null,
        ): Promise<PodcastIndexResponse>
        recentSoundbites(max?: number): Promise<PodcastIndexResponse>

        // Value
        valueByFeedId(feedId: number): Promise<PodcastIndexResponse>
        valueByFeedUrl(feedUrl: string): Promise<PodcastIndexResponse>

        // Categories
        categoriesList(): Promise<PodcastIndexResponse>

        // Notify Hub
        hubPubNotifyById(feedId: number): Promise<PodcastIndexResponse>
        hubPubNotifyByUrl(feedUrl: string): Promise<PodcastIndexResponse>
    }
}

export = podcastIndexApi

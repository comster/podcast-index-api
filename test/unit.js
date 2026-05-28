// Offline unit tests: these stub global.fetch, so they need no credentials
// and make no network calls. They cover request building, auth signing,
// query handling, and error behavior.

const crypto = require('crypto')
const lib = require('../index.js')
const { PodcastIndexError } = lib

const KEY = 'test-key'
const SECRET = 'test-secret'
const USER_AGENT = 'podcast-index-api/unit-test'
const BASE = 'https://api.podcastindex.org/api/1.0/'

const realFetch = global.fetch

// Stub global.fetch with a single response. `body` may be an object (sent as
// JSON) or a raw string (e.g. an HTML error page). Returns the jest mock.
function stubFetch(status, body) {
    const text = typeof body === 'string' ? body : JSON.stringify(body)
    const mock = jest.fn(async () => ({
        status,
        text: async () => text,
    }))
    global.fetch = mock
    return mock
}

afterEach(() => {
    global.fetch = realFetch
})

describe('factory validation', () => {
    it('throws when key, secret, or userAgent is missing', () => {
        expect(() => lib()).toThrow()
        expect(() => lib(KEY)).toThrow()
        expect(() => lib(KEY, SECRET)).toThrow()
        expect(() => lib(KEY, SECRET, USER_AGENT)).not.toThrow()
    })

    it('exposes the PodcastIndexError class', () => {
        expect(typeof PodcastIndexError).toBe('function')
        expect(new PodcastIndexError('x', 1) instanceof Error).toBe(true)
    })
})

describe('request building and signing', () => {
    it('builds the URL and signed auth headers', async () => {
        const mock = stubFetch(200, { status: 'true', feeds: [] })
        const api = lib(KEY, SECRET, USER_AGENT)
        await api.searchByTerm('joerogan')

        expect(mock).toHaveBeenCalledTimes(1)
        const [url, opts] = mock.mock.calls[0]
        expect(url).toBe(`${BASE}search/byterm?q=joerogan`)

        const h = opts.headers
        expect(h['User-Agent']).toBe(USER_AGENT)
        expect(h['X-Auth-Key']).toBe(KEY)
        expect(typeof h['X-Auth-Date']).toBe('string')
        expect(h['Authorization']).toMatch(/^[a-f0-9]{40}$/)
        // The signature must be sha1(key + secret + X-Auth-Date)
        const expected = crypto
            .createHash('sha1')
            .update(KEY + SECRET + h['X-Auth-Date'])
            .digest('hex')
        expect(h['Authorization']).toBe(expected)
    })

    it('omits null/undefined params but keeps presence flags', async () => {
        const mock = stubFetch(200, { status: 'true' })
        const api = lib(KEY, SECRET, USER_AGENT)

        await api.podcastsTrending(10, null, null, null, null)
        expect(mock.mock.calls[0][0]).toBe(`${BASE}podcasts/trending?max=10`)

        mock.mockClear()
        await api.searchByTerm('q', '', false, true) // fullText flag on
        const url = mock.mock.calls[0][0]
        expect(url).toContain('q=q')
        expect(url).toContain('fullText=')
    })
})

describe('responses and errors', () => {
    it('resolves the parsed body on success', async () => {
        stubFetch(200, { status: 'true', feeds: [{ id: 1 }] })
        const api = lib(KEY, SECRET, USER_AGENT)
        await expect(api.searchByTerm('x')).resolves.toEqual({
            status: 'true',
            feeds: [{ id: 1 }],
        })
    })

    it('throws PodcastIndexError when status is "false"', async () => {
        stubFetch(400, { status: 'false', description: 'Feed url not found.' })
        const api = lib(KEY, SECRET, USER_AGENT)
        expect.assertions(5)
        try {
            await api.podcastsByFeedUrl('http://nope')
        } catch (e) {
            expect(e).toBeInstanceOf(Error)
            expect(e).toBeInstanceOf(PodcastIndexError)
            expect(e.code).toBe(400)
            expect(e.message).toBe('Feed url not found.')
            expect(e.body).toEqual({
                status: 'false',
                description: 'Feed url not found.',
            })
        }
    })

    it('throws PodcastIndexError on HTTP 500', async () => {
        stubFetch(500, { status: 'true' })
        const api = lib(KEY, SECRET, USER_AGENT)
        await expect(api.categoriesList()).rejects.toBeInstanceOf(
            PodcastIndexError,
        )
    })

    it('throws PodcastIndexError on a non-JSON body', async () => {
        stubFetch(403, '<!DOCTYPE html><html>blocked</html>')
        const api = lib(KEY, SECRET, USER_AGENT)
        expect.assertions(3)
        try {
            await api.categoriesList()
        } catch (e) {
            expect(e).toBeInstanceOf(PodcastIndexError)
            expect(e.code).toBe(403)
            expect(e.message).toContain('DOCTYPE')
        }
    })

    it('low-level api() does not throw on API errors', async () => {
        stubFetch(400, { status: 'false', description: 'nope' })
        const api = lib(KEY, SECRET, USER_AGENT)
        const r = await api.api('podcasts/byfeedurl?url=x')
        expect(r.statusCode).toBe(400)
        expect(r.body).toEqual({ status: 'false', description: 'nope' })
    })
})

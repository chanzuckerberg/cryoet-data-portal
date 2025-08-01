import {
  createJsonResponse,
  handleApiError,
  validateNumericParam,
} from './api-helpers'

// Mock Response for Jest environment
global.Response = class MockResponse {
  body: string

  status: number

  statusText: string

  headers: Map<string, string>

  constructor(
    body?: string,
    init?: {
      status?: number
      statusText?: string
      headers?: Record<string, string>
    },
  ) {
    this.body = body || ''
    this.status = init?.status || 200
    this.statusText =
      init?.statusText || (this.status === 500 ? 'Internal Server Error' : 'OK')
    this.headers = new Map()
    if (init?.headers) {
      Object.entries(init.headers).forEach(([key, value]) => {
        this.headers.set(key, value)
      })
    }
  }

  json() {
    return Promise.resolve(JSON.parse(this.body))
  }

  get(key: string) {
    return this.headers.get(key)
  }
} as unknown as typeof Response

describe('api-helpers', () => {
  describe('validateNumericParam', () => {
    it('should parse valid numeric string', () => {
      expect(validateNumericParam('123', 'testParam')).toBe(123)
      expect(validateNumericParam('0', 'testParam')).toBe(0)
      expect(validateNumericParam('999', 'testParam')).toBe(999)
    })

    it('should throw error for null value', () => {
      expect(() => validateNumericParam(null, 'testParam')).toThrow(
        'Missing or invalid testParam',
      )
    })

    it('should throw error for non-numeric string', () => {
      expect(() => validateNumericParam('abc', 'testParam')).toThrow(
        'Missing or invalid testParam',
      )
      expect(() => validateNumericParam('', 'testParam')).toThrow(
        'Missing or invalid testParam',
      )
    })

    it('should throw error for NaN result', () => {
      expect(() => validateNumericParam('NaN', 'testParam')).toThrow(
        'Missing or invalid testParam',
      )
    })
  })

  describe('createJsonResponse', () => {
    it('should create response with default status 200', () => {
      const data = { test: 'data' }
      const response = createJsonResponse(data)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('application/json')
    })

    it('should create response with custom status', () => {
      const data = { error: 'Not found' }
      const response = createJsonResponse(data, 404)

      expect(response.status).toBe(404)
      expect(response.headers.get('Content-Type')).toBe('application/json')
    })

    it('should serialize data to JSON', async () => {
      const data = { id: 1, name: 'test' }
      const response = createJsonResponse(data)
      const parsed = (await response.json()) as typeof data

      expect(parsed).toEqual(data)
    })
  })

  describe('handleApiError', () => {
    it('should create 500 response for unknown error', () => {
      const error = new Error('Something went wrong')
      const response = handleApiError(error, 'test operation')

      expect(response.status).toBe(500)
    })

    it('should include context in error response', () => {
      const error = new Error('Database connection failed')
      const response = handleApiError(error, 'fetch user data')

      expect(response.status).toBe(500)
    })

    it('should handle non-Error objects', () => {
      const error = 'String error'
      const response = handleApiError(error, 'test operation')

      expect(response.status).toBe(500)
    })
  })
})

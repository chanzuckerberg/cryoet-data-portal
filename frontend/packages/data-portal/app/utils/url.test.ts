import { isExternalUrl } from './url'

describe('utils/url', () => {
  describe('isExternalUrl()', () => {
    it('should return true for external URLs', () => {
      expect(isExternalUrl('https://www.google.com')).toBe(true)
    })

    it('should return true for non-external URLs', () => {
      expect(isExternalUrl('/faq')).toBe(false)
    })
  })
})

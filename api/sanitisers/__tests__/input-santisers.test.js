import { removeHTMLTags } from '../input-sanitisers'

describe('input-sanitisers', () => {
  beforeEach(() => {

  })

  afterEach(() => {

  })

  describe('removeHTMLTags()', () => {
    test('should strip HTML tags from the given string', () => {
      const input = '<h1>Hello World</h1>'
      const output = 'Hello World'

      const result = removeHTMLTags(input)

      expect(result).toBe(output)
    })
  })
})

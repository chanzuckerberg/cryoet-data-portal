import {
  dedupeObjectsByIdentity,
  getObjectIdentityKey,
} from './annotationObject'

describe('getObjectIdentityKey()', () => {
  it('produces the same key only when all four fields match', () => {
    const base = {
      objectName: 'membrane',
      objectId: 'GO:0016020',
      objectState: null,
      objectDescription: 'Lipid bilayer',
    }

    expect(getObjectIdentityKey(base)).toBe(getObjectIdentityKey({ ...base }))
    expect(getObjectIdentityKey(base)).not.toBe(
      getObjectIdentityKey({ ...base, objectDescription: '' }),
    )
    expect(getObjectIdentityKey(base)).not.toBe(
      getObjectIdentityKey({ ...base, objectId: 'GO:0000001' }),
    )
  })

  it('treats nullish and missing fields consistently', () => {
    expect(getObjectIdentityKey({ objectName: 'a' })).toBe(
      getObjectIdentityKey({
        objectName: 'a',
        objectId: null,
        objectState: undefined,
        objectDescription: null,
      }),
    )
  })
})

describe('dedupeObjectsByIdentity()', () => {
  it('removes only entries matching on all four fields', () => {
    const objects = [
      {
        objectName: 'membrane',
        objectId: 'GO:0016020',
        objectDescription: 'x',
      },
      {
        objectName: 'membrane',
        objectId: 'GO:0016020',
        objectDescription: 'x',
      }, // exact dup -> dropped
      { objectName: 'membrane', objectId: 'GO:0016020', objectDescription: '' }, // diff desc -> kept
      {
        objectName: 'ribosome',
        objectId: 'GO:0005840',
        objectDescription: 'x',
      },
    ]

    const result = dedupeObjectsByIdentity(objects)

    expect(result).toHaveLength(3)
    expect(result.map((o) => o.objectDescription)).toEqual(['x', '', 'x'])
  })

  it('preserves first occurrence and original ordering', () => {
    const objects = [
      { objectName: 'b' },
      { objectName: 'a' },
      { objectName: 'b' },
    ]

    expect(dedupeObjectsByIdentity(objects).map((o) => o.objectName)).toEqual([
      'b',
      'a',
    ])
  })
})

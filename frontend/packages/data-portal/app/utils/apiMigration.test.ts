import { pickAPISource, remapAPI } from './apiMigration'

describe('remapAPI', () => {
  it('should perform basic renaming of fields', () => {
    type Source = {
      id: number
      name: string
      age: number
    }

    type Target = {
      employeeId: number
      employeeName: string
      employeeAge: number
    }

    const fieldMap = {
      employeeId: 'id',
      employeeName: 'name',
      employeeAge: 'age',
    } as const

    const source2target = remapAPI<Source, Target>(fieldMap)

    expect(
      source2target({
        id: 1,
        name: 'John Smith',
        age: 42,
      }),
    ).toStrictEqual({
      employeeId: 1,
      employeeName: 'John Smith',
      employeeAge: 42,
    })
  })

  it('should keep common fields between remaps', () => {
    type Source = {
      id: number
      name: string
      age: number
    }

    type Target = {
      identifier: number
      name: string
      age: number
    }

    const fieldMap = {
      identifier: 'id',
      name: 'name',
      age: 'age',
    } as const

    const source2target = remapAPI<Source, Target>(fieldMap)

    expect(
      source2target({
        id: 1,
        name: 'John Smith',
        age: 42,
      }),
    ).toStrictEqual({
      identifier: 1,
      name: 'John Smith',
      age: 42,
    })
  })

  it('should be able to exclude unused fields', () => {
    type Source = {
      name: string
      age: number
      SSN: string
    }

    type Target = {
      id: number
      name: string
      age: number
    }

    const fieldMap = {
      name: 'name',
      age: 'age',
    } as const

    const source2target = remapAPI<Source, Target, 'id'>(fieldMap)

    expect(
      source2target({
        name: 'John Smith',
        age: 42,
        SSN: '123-45-6789',
      }),
    ).toStrictEqual({
      name: 'John Smith',
      age: 42,
    })
  })

  it('should accept function for more complex remapping', () => {
    type Source = {
      name: string
      age: number
      alive: boolean
    }

    type Target = {
      name: string
      age: number
      status: 'alive' | 'dead'
    }

    const fieldMap = {
      name: 'name',
      age: 'age',
      status: (source: Source) => (source.alive ? 'alive' : 'dead'),
    } as const

    const source2target = remapAPI<Source, Target>(fieldMap)

    expect(
      source2target({
        name: 'John Smith',
        age: 42,
        alive: true,
      }),
    ).toStrictEqual({
      name: 'John Smith',
      age: 42,
      status: 'alive',
    })
  })

  it('should be able to handle nested fields', () => {
    type Source = {
      name: { first: string; last: string }
      age: number
    }

    type Target = {
      name: string
      age: number
      status: 'alive' | 'dead'
    }

    const fieldMap = {
      name: (source: Source) => `${source.name.first} ${source.name.last}`,
      age: 'age',
    } as const

    const source2target = remapAPI<Source, Target, 'status'>(fieldMap)

    expect(
      source2target({
        name: { first: 'John', last: 'Smith' },
        age: 42,
      }),
    ).toStrictEqual({
      name: 'John Smith',
      age: 42,
    })
  })
})

describe('pickAPISource', () => {
  it('should pick fields from multiple sources', () => {
    type Structure = {
      name: string
      age: number
      status: 'alive' | 'dead' | 'unknown'
    }

    const sources = {
      source1: {
        name: 'John Smith',
        age: 42,
        status: 'alive',
      },
      source2: {
        name: 'Jane Doe',
        age: 35,
        status: 'dead',
      },
      source3: {
        name: 'Alice Johnson',
        age: 28,
        status: 'unknown',
      },
    } as const

    const key = {
      name: 'source1',
      age: 'source2',
      status: 'source3',
    } as const

    expect(pickAPISource<Structure>(sources, key)).toStrictEqual({
      name: 'John Smith',
      age: 35,
      status: 'unknown',
    })
  })

  it('should be able to handle nested fields', () => {
    type Person = {
      name: string
      parents: Person[]
      ageInfo: {
        age: number
        birthday: string
      }
    }

    const sources = {
      source1: {
        name: 'John Smith',
        parents: [
          {
            name: 'John Smith Sr.',
            parents: [],
            ageInfo: {
              age: 70,
              birthday: '1950-01-01',
            },
          },
          {
            name: 'Jane Smith',
            parents: [],
            ageInfo: {
              age: 68,
              birthday: '1952-01-01',
            },
          },
        ],
        ageInfo: {
          age: 42,
          birthday: '1980-01-01',
        },
      },
      source2: {
        name: 'Jane Doe',
        parents: [
          {
            name: 'John Doe Sr.',
            parents: [],
            ageInfo: {
              age: 72,
              birthday: '1948-01-01',
            },
          },
          {
            name: 'Jane Doe',
            parents: [],
            ageInfo: {
              age: 70,
              birthday: '1950-01-01',
            },
          },
        ],
        ageInfo: {
          age: 35,
          birthday: '1985-01-01',
        },
      },
    } as { [key: string]: Person }

    const key = {
      name: 'source1',
      parents: {
        name: 'source2',
        parents: 'source1',
        ageInfo: {
          age: 'source1',
          birthday: 'source2',
        },
      },
      ageInfo: {
        age: 'source1',
        birthday: 'source2',
      },
    } as const

    expect(pickAPISource<Person>(sources, key)).toStrictEqual({
      name: 'John Smith',
      parents: [
        {
          name: 'John Doe Sr.',
          parents: [],
          ageInfo: {
            age: 70,
            birthday: '1948-01-01',
          },
        },
        {
          name: 'Jane Doe',
          parents: [],
          ageInfo: {
            age: 68,
            birthday: '1950-01-01',
          },
        },
      ],
      ageInfo: {
        age: 42,
        birthday: '1985-01-01',
      },
    })
  })
})

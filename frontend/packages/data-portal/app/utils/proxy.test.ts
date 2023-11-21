/* eslint-disable no-underscore-dangle */
/* eslint-disable jest/expect-expect */

import { Datasets_Bool_Exp } from 'app/__generated__/graphql'

import { getSelfCreatingObject } from './proxy'

describe('proxy', () => {
  describe('getSelfCreatingObject()', () => {
    it('should create nested objects if it does not exist', () => {
      interface Person {
        name: string
        address: {
          street: string
          city: string
        }
      }

      const person = getSelfCreatingObject<Person>()
      const expected: Person = {
        name: 'Foo Bar',
        address: {
          street: 'Foo',
          city: 'Bar',
        },
      }

      expect(person).not.toMatchObject(expected)

      person.name = 'Foo Bar'
      person.address.street = 'Foo'
      person.address.city = 'Bar'

      expect(person).toMatchObject(expected)
    })

    it('should shit', () => {
      const filter = getSelfCreatingObject<Datasets_Bool_Exp>()

      filter.runs.tomogram_voxel_spacings.annotations.ground_truth_status._eq =
        true
    })
  })
})

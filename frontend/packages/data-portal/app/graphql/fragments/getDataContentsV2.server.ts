import { gql } from 'app/__generated_v2__'

export const GET_DATA_CONTENTS_FRAGMENT = gql(`
  fragment DataContents on Run {
    tomogramsAggregate {
      aggregate {
        count
      }
    }
    framesAggregate(where: {httpsFramePath: {_is_null: false}}) {
      aggregate {
        count
      }
    }
    alignmentsAggregate(where: {alignmentMethod: {_is_null: false}}) {
      aggregate {
        count
      }
    }
    annotationsAggregate {
      aggregate {
        count
      }
    }
    tiltseriesAggregate {
      aggregate {
        count
      }
    }
    perSectionParametersAggregate(where: {majorDefocus: {_is_null: false}}) {
      aggregate {
        count
      }
    }
  }
`)

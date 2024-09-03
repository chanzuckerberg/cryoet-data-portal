import { Depositions_Bool_Exp } from 'app/__generated__/graphql'

export const depositionWithAnnotationFilter: Depositions_Bool_Exp = {
  annotations_aggregate: {
    count: {
      predicate: {
        _gt: 0,
      },
    },
  },
}

import { Depositions_Bool_Exp } from 'app/__generated__/graphql'
import { DepositionType } from 'app/types/depositionTypes'

export const depositionTypeFilter: Depositions_Bool_Exp = {
  deposition_types: {
    _eq: DepositionType.Annotation,
  },
}

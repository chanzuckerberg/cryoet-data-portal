import { GetDepositionByIdV2Query } from 'app/__generated_v2__/graphql'

export type Dataset = GetDepositionByIdV2Query['datasets'][number]
export type MethodLink = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        GetDepositionByIdV2Query['depositions'][number]['annotationMethodAndMethodLinksCombinations']
      >['aggregate']
    >[number]['groupBy']
  >['methodLinks']
>

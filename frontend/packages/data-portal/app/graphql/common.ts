import { Depositions_Bool_Exp } from 'app/__generated__/graphql'
import { Tomogram_Reconstruction_Method_Enum } from 'app/__generated_v2__/graphql'

export const depositionWithAnnotationFilter: Depositions_Bool_Exp = {
  annotations_aggregate: {
    count: {
      predicate: {
        _gt: 0,
      },
    },
  },
}

export function convertReconstructionMethodToV2(
  v1: string,
): Tomogram_Reconstruction_Method_Enum {
  switch (v1) {
    case 'Fourier Space':
      return Tomogram_Reconstruction_Method_Enum.FourierSpace
    case 'SART':
      return Tomogram_Reconstruction_Method_Enum.Sart
    case 'SIRT':
      return Tomogram_Reconstruction_Method_Enum.Sirt
    case 'WBP':
      return Tomogram_Reconstruction_Method_Enum.Wbp
    case 'Unknown':
    default:
      return Tomogram_Reconstruction_Method_Enum.Unknown
  }
}

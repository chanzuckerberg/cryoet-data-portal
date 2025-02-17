/* eslint-disable @typescript-eslint/no-throw-literal */

// import { ShouldRevalidateFunctionArgs } from '@remix-run/react'
// import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'
// import { startCase, toNumber } from 'lodash-es'
// import { match } from 'ts-pattern'

// import { apolloClient, apolloClientV2 } from 'app/apollo.server'
// import { AnnotationFilter } from 'app/components/AnnotationFilter/AnnotationFilter'
// import { DepositionFilterBanner } from 'app/components/DepositionFilterBanner'
// import { DownloadModal } from 'app/components/Download'
// import { NoFilteredResults } from 'app/components/NoFilteredResults'
// import { NoTotalResults } from 'app/components/NoTotalResults'
// import { RunHeader } from 'app/components/Run'
// import { AnnotationDrawer } from 'app/components/Run/AnnotationDrawer'
// import { AnnotationTable } from 'app/components/Run/AnnotationTable'
// import { RunMetadataDrawer } from 'app/components/Run/RunMetadataDrawer'
// import { TomogramMetadataDrawer } from 'app/components/Run/TomogramMetadataDrawer'
// import { TomogramsTable } from 'app/components/Run/TomogramTable'
// import { TablePageLayout } from 'app/components/TablePageLayout'
// import { QueryParams } from 'app/constants/query'
// import { getRunById } from 'app/graphql/getRunById.server'
// import { logIfHasDiff } from 'app/graphql/getRunByIdDiffer'
// import { getRunByIdV2 } from 'app/graphql/getRunByIdV2.server'
// import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
// import { useI18n } from 'app/hooks/useI18n'
// import { useQueryParam } from 'app/hooks/useQueryParam'
// import { useRunById } from 'app/hooks/useRunById'
// import { DownloadConfig } from 'app/types/download'
// import { shouldRevalidatePage } from 'app/utils/revalidate'

// export async function loader({ request, params }: LoaderFunctionArgs) {
//   const id = params.id ? +params.id : NaN

//   if (Number.isNaN(+id)) {
//     throw new Response(null, {
//       status: 400,
//       statusText: 'ID is not defined',
//     })
//   }

//   const url = new URL(request.url)
//   const annotationsPage = +(
//     url.searchParams.get(QueryParams.AnnotationsPage) ?? '1'
//   )
//   const depositionId = Number(url.searchParams.get(QueryParams.DepositionId))

//   const [{ data: responseV1 }, { data: responseV2 }] = await Promise.all([
//     getRunById({
//       id,
//       annotationsPage,
//       depositionId: Number.isNaN(depositionId) ? undefined : depositionId,
//       client: apolloClient,
//       params: url.searchParams,
//     }),
//     getRunByIdV2({
//       client: apolloClientV2,
//       id,
//       annotationsPage,
//       params: url.searchParams,
//       depositionId: Number.isNaN(depositionId) ? undefined : depositionId,
//     }),
//   ])

//   if (responseV1.runs.length === 0) {
//     throw new Response(null, {
//       status: 404,
//       statusText: `Run with ID ${id} not found`,
//     })
//   }

//   try {
//     logIfHasDiff(request.url, responseV1, responseV2)
//   } catch (error) {
//     // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
//     console.log(`DIFF ERROR: ${(error as any)?.stack}`)
//   }

//   return json({
//     v1: responseV1,
//     v2: responseV2,
//   })
// }

// export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
//   return shouldRevalidatePage({
//     ...args,
//     paramsToRefetch: [
//       QueryParams.AuthorName,
//       QueryParams.AuthorOrcid,
//       QueryParams.ObjectName,
//       QueryParams.ObjectId,
//       QueryParams.ObjectShapeType,
//       QueryParams.MethodType,
//       QueryParams.AnnotationSoftware,
//       QueryParams.AnnotationsPage,
//       QueryParams.DepositionId,
//     ],
//   })
// }


import { lazy, Suspense } from 'react';

const ViewerPage = lazy(() => import("app/components/Run/ViewerPage"));

export default function RunByIdViewerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewerPage />
    </Suspense>
  );
}

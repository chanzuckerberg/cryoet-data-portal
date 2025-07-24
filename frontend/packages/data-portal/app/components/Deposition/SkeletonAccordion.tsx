import Skeleton from '@mui/material/Skeleton'

export function SkeletonAccordion() {
  return (
    <div className="px-sds-xl py-sds-m border-b-2 border-light-sds-color-semantic-base-divider">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sds-s">
          <Skeleton variant="text" width={240} height={24} />

          <div className="flex items-center gap-sds-xs">
            <Skeleton variant="text" width={20} height={20} />
            <Skeleton variant="text" width={60} height={20} />
          </div>
        </div>

        <Skeleton variant="text" width={120} height={20} />
      </div>
    </div>
  )
}

import { cns } from 'app/utils/cns'

export function FilterPanel() {
  return (
    <div
      className={cns(
        'flex flex-col flex-shrink-0',
        'w-[200px] items-center justify-center',
        'border-r border-sds-gray-300',
      )}
    >
      <p>Filters</p>
    </div>
  )
}

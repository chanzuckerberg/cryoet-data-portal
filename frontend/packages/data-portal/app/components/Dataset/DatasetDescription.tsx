import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'

export function DatasetDescription() {
  const { dataset } = useDatasetById()

  // TODO: make the below grouping more efficient
  const authorsPrimary = dataset.authors.filter(
    (author) => author.primary_author_status,
  )
  const authorsCorresponding = dataset.authors.filter(
    (author) => author.corresponding_author_status,
  )
  const authorsOther = dataset.authors.filter(
    (author) =>
      !(author.primary_author_status || author.corresponding_author_status),
  )

  return (
    <div className="flex flex-col w-full gap-sds-xl">
      <p className="text-sds-body-m leading-sds-body-m">
        {dataset.description}
      </p>
      <div className="flex flex-col gap-sds-xs">
        <h3
          className="font-semibold uppercase text-sds-gray-500 text-sds-caps-xxxs leading-sds-caps-xxxs tracking-sds-caps"
          // FIXME: why does text-sds-gray-500 not show up in the class in html when concatenated?
          // className={cns(
          //   'font-semibold uppercase',
          //   'text-sds-gray-500',
          //   'text-sds-caps-xxxs leading-sds-caps-xxxs tracking-sds-caps',
          // )}
        >
          {i18n.authors}
        </h3>
        <p className="text-sds-body-xxs leading-sds-body-xxs">
          <span className="font-semibold">
            {authorsPrimary.map((author, i, arr) => (
              <>
                {author.name}
                {!(
                  authorsOther.length + authorsCorresponding.length === 0 &&
                  arr.length - 1 === i
                ) && <>; </>}
              </>
            ))}
          </span>
          <span className="text-sds-gray-600">
            {authorsOther.map((author, i, arr) => (
              <>
                {author.name}
                {!(
                  authorsCorresponding.length === 0 && arr.length - 1 === i
                ) && <>; </>}
              </>
            ))}
            {authorsCorresponding.map((author, i, arr) => (
              <>
                {author.name}
                {!(arr.length - 1 === i) && <>; </>}
              </>
            ))}
          </span>
        </p>
      </div>
    </div>
  )
}

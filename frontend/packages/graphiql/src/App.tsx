import 'graphiql/graphiql.css'

import { createGraphiQLFetcher } from '@graphiql/toolkit'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import clsx from 'clsx'
import GraphiQL from 'graphiql'
import { useMemo, useState } from 'react'

export function App() {
  const [fetcherUrl, setFetcherUrl] = useState(
    'https://graphql.cryoetdataportal.cziscience.com/v1/graphql',
  )
  const [urlInput, setUrlInput] = useState(fetcherUrl)

  const fetcher = useMemo(
    () => createGraphiQLFetcher({ url: fetcherUrl }),
    [fetcherUrl],
  )

  return (
    <>
      <div className="flex gap-4 items-center px-8 pt-4">
        <p className="text-xl">URL</p>

        <div className="flex flex-auto max-w-[600px] min-w-[600px] gap-2">
          <TextField
            fullWidth
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />

          <Button
            className={clsx(urlInput !== fetcherUrl ? 'visible' : 'invisible')}
            onClick={() => setUrlInput(fetcherUrl)}
            disabled={urlInput === fetcherUrl}
          >
            Reset
          </Button>

          <Button
            className={clsx(urlInput !== fetcherUrl ? 'visible' : 'invisible')}
            onClick={() => setFetcherUrl(urlInput)}
            disabled={urlInput === fetcherUrl}
          >
            Apply
          </Button>
        </div>
      </div>

      <GraphiQL fetcher={fetcher} />
    </>
  )
}

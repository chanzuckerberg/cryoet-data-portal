import { useParams } from '@remix-run/react'

import { Demo } from 'app/components/Demo'

export default function RunByIdPage() {
  const params = useParams()
  return (
    <Demo>
      <span className="text-5xl">Run Page ID = {params.id}</span>
    </Demo>
  )
}

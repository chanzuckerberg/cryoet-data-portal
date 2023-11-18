import type { MetaFunction } from '@remix-run/node'

import { IndexContent, IndexHeader } from 'app/components/Index'

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Remix Starter',
      description: 'Welcome to remix!',
    },
  ]
}

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <IndexHeader />
      <IndexContent />
    </div>
  )
}

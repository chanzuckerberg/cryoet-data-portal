import { pick } from 'lodash-es'

export async function loader() {
  const extensions = [
    'outbound-links',
    'file-downloads',
    ...(process.env.LOCALHOST_PLAUSIBLE_TRACKING === 'true' ? ['local'] : []),
  ].join('.')
  const plausibleUrl = `https://plausible.io/js/script.${extensions}.js`

  const response = await fetch(plausibleUrl)
  const script = await response.text()
  const { status, headers } = response

  return new Response(script, {
    status,
    headers: pick(headers, [
      'cache-control',
      'content-encoding',
      'content-type',
    ]) as Record<string, string>,
  })
}

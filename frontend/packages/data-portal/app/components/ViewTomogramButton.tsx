import { Button, ButtonProps } from '@czi-sds/components'

import { useI18n } from 'app/hooks/useI18n'
import { EventPayloads, Events, usePlausible } from 'app/hooks/usePlausible'

import { Link } from './Link'

export function ViewTomogramButton({
  buttonProps,
  event,
  neuroglancerConfig,
  setIsHoveringOver,
}: {
  buttonProps: Partial<ButtonProps>
  event: EventPayloads[Events.ViewTomogram]
  neuroglancerConfig: string | null | undefined
  setIsHoveringOver?: (boolean) => void
}) {
  const plausible = usePlausible()
  const { t } = useI18n()

  if (!neuroglancerConfig) {
    return null
  }

  function trackViewTomogram() {
    plausible(Events.ViewTomogram, event)
  }

  return (
    // We need to disable this rule because we need the div to capture
    // bubbled click events from the link button below. This is because
    // Plausible automatically adds event listeners to every link on the
    // page to track outbound links, so we can't attach a click listener
    // to the link directly because Plausible will overwrite it.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onClick={trackViewTomogram}
      onKeyDown={({ key }) => {
        if (key === 'Enter') {
          trackViewTomogram()
        }
      }}
      onMouseEnter={() => setIsHoveringOver?.(true)}
      onMouseLeave={() => setIsHoveringOver?.(false)}
    >
      <Button
        to={`https://neuroglancer-demo.appspot.com/#!${encodeURIComponent(
          neuroglancerConfig,
        )}`}
        component={Link}
        {...buttonProps}
      >
        <span>{t('viewTomogram')}</span>
      </Button>
    </div>
  )
}

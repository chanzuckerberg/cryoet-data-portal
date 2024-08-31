import { Button, ButtonProps } from '@czi-sds/components'

import { useI18n } from 'app/hooks/useI18n'
import { EventPayloads, Events, usePlausible } from 'app/hooks/usePlausible'
import { useFeatureFlag } from 'app/utils/featureFlags'
import { getNeuroglancerUrl } from 'app/utils/url'

import { Link } from './Link'
import { Tooltip } from './Tooltip'

export interface ViewTomogramButtonProps {
  tomogramId?: string
  buttonProps: Partial<ButtonProps>
  event: EventPayloads[Events.ViewTomogram]
  neuroglancerConfig: string | null | undefined
  setIsHoveringOver?: (isHoveringOver: boolean) => void
}

export function ViewTomogramButton({
  tomogramId,
  buttonProps,
  event,
  neuroglancerConfig,
  setIsHoveringOver,
}: ViewTomogramButtonProps) {
  const multipleTomogramsEnabled = useFeatureFlag('multipleTomograms')
  const plausible = usePlausible()
  const { t } = useI18n()

  function trackViewTomogram() {
    plausible(Events.ViewTomogram, event)
  }

  const enabled = tomogramId !== undefined && neuroglancerConfig != null
  const enabledTooltipText = multipleTomogramsEnabled
    ? t('viewTomogramInNeuroglancer', { id: tomogramId })
    : undefined
  const disabledTooltipText = multipleTomogramsEnabled
    ? t('noTomogramsAvailable')
    : t('noTomogramAvailable')

  return (
    <Tooltip
      tooltip={enabled ? enabledTooltipText : disabledTooltipText}
      sdsStyle="dark"
      center
      widthPx={200}
    >
      {/* We need to disable this rule because we need the div to capture bubbled click events from
       the link button below. This is because Plausible automatically adds event listeners to every
       link on the page to track outbound links, so we can't attach a click listener to the link
       directly because Plausible will overwrite it. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
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
          to={enabled ? getNeuroglancerUrl(neuroglancerConfig) : ''}
          component={Link}
          disabled={!enabled}
          {...buttonProps}
        >
          <span>{t('viewTomogram')}</span>
        </Button>
      </div>
    </Tooltip>
  )
}

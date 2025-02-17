import { Button, ButtonProps, TooltipProps } from '@czi-sds/components'

import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { EventPayloads, Events, usePlausible } from 'app/hooks/usePlausible'
import { getNeuroglancerUrl } from 'app/utils/url'

import { Link } from './Link'
import { Tooltip } from './Tooltip'
import { useLocation } from '@remix-run/react'

export interface ViewTomogramButtonProps {
  tomogramId?: string

  buttonProps: Partial<ButtonProps>
  event: EventPayloads[Events.ViewTomogram]
  neuroglancerConfig: string | null | undefined
  tooltipPlacement: TooltipProps['placement']
  setIsHoveringOver?: (isHoveringOver: boolean) => void,
}

export function ViewTomogramButton({
  tomogramId,
  buttonProps,
  event,
  neuroglancerConfig,
  tooltipPlacement,
  setIsHoveringOver,
}: ViewTomogramButtonProps) {
  const plausible = usePlausible()
  const { t } = useI18n()

  function trackViewTomogram() {
    plausible(Events.ViewTomogram, event)
  }

  const enabled = tomogramId !== undefined && neuroglancerConfig != null
  const runId = useLocation().pathname.slice(6)

  return (
    <Tooltip
      tooltip={
        enabled
          ? t('viewTomogramInNeuroglancer', {
              id: `${IdPrefix.Tomogram}-${tomogramId}`,
            })
          : t('noTomogramsAvailable')
      }
      sdsStyle="dark"
      center
      placement={tooltipPlacement}
      size="s"
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
        className="min-w-[144px]"
      >
        <Button
          // href={enabled ? getNeuroglancerUrl(neuroglancerConfig) : undefined}
          href={enabled ? `/view/runs/${runId}/#!${encodeURIComponent(neuroglancerConfig)}` : undefined}
          disabled={!enabled}
          LinkComponent={Link}
          {...buttonProps}
        >
          <span>{t('viewTomogram')}</span>
        </Button>
      </div>
    </Tooltip>
  )
}

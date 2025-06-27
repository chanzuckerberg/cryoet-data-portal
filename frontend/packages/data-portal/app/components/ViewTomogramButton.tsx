import { Button, ButtonProps, TooltipProps } from '@czi-sds/components'

import { I18n } from 'app/components/I18n'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { EventPayloads, Events, usePlausible } from 'app/hooks/usePlausible'

import { Link } from './Link'
import { Tooltip } from './Tooltip'

export interface ViewTomogramButtonProps {
  tomogramId?: string

  buttonProps: Partial<ButtonProps>
  event: EventPayloads[Events.ViewTomogram]
  neuroglancerConfig: string | null | undefined
  tooltipPlacement: TooltipProps['placement']
  setIsHoveringOver?: (isHoveringOver: boolean) => void
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
  return (
    <Tooltip
      tooltip={
        enabled ? (
          <>
            <h4 className="font-semibold">
              {t('viewTomogramInNeuroglancer', {
                id: `${IdPrefix.Tomogram}-${tomogramId}`,
              })}
            </h4>
            <Link
              to={t('neuroglancerTutorialLink')}
              variant="dashed-underlined"
              stopPropagation
              className="!text-light-sds-color-primitive-gray-300 text-sds-body-xxs-400-wide !border-light-sds-color-primitive-gray-800"
            >
              <p>
                <I18n i18nKey="viewNeuroglancerTutorial" />
              </p>
            </Link>
          </>
        ) : (
          t('noTomogramsAvailable')
        )
      }
      sdsStyle="dark"
      center
      placement={tooltipPlacement}
      size="m"
    >
      {/* We need to disable this rule because we need the div to capture bubbled click events from
       the link button below. This is because Plausible automatically adds event listeners to every
       link on the page to track outbound links, so we can't attach a click listener to the link
       directly because Plausible will overwrite it. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        onClick={(e) => {
          e.stopPropagation()
          trackViewTomogram()
        }}
        onKeyDown={({ key }) => {
          if (key === 'Enter') {
            trackViewTomogram()
          }
        }}
        onMouseEnter={() => setIsHoveringOver?.(false)} // could be changed back to true if we needed this fine-grained control
        onMouseLeave={() => setIsHoveringOver?.(false)}
        className="min-w-[152px]"
      >
        <Button
          // href={enabled ? getNeuroglancerUrl(neuroglancerConfig) : undefined}
          href={
            enabled
              ? `/view/runs/${event.runId}/#!${encodeURIComponent(neuroglancerConfig)}`
              : undefined
          }
          disabled={!enabled}
          LinkComponent={Link}
          {...(buttonProps as ButtonProps)}
        >
          <span>{t('viewTomogram')}</span>
        </Button>
      </div>
    </Tooltip>
  )
}

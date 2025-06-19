import { Button, ButtonProps, TooltipProps, Icon } from '@czi-sds/components'

import { I18n } from 'app/components/I18n'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { EventPayloads, Events, usePlausible } from 'app/hooks/usePlausible'

import { Link } from './Link'
import { Tooltip } from './Tooltip'

export interface CitationButtonProps {
  buttonProps: Partial<ButtonProps>
  //event: EventPayloads[Events.CitePortal]
  tooltipPlacement: TooltipProps['placement']
  setIsHoveringOver?: (isHoveringOver: boolean) => void
}

export function CitationButton({
  buttonProps,
  //event,
  tooltipPlacement,
  setIsHoveringOver,
}: CitationButtonProps) {
  //const plausible = usePlausible()
  const { t } = useI18n()

  // function trackCitation() {
  //   plausible(Events.CitePortal, event)
  // }
  return (
    <Tooltip
      tooltip={
        <>
          <h4 className="font-semibold">{t('citePortalText')}</h4>
        </>
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
        }}
        onMouseEnter={() => setIsHoveringOver?.(false)} // could be changed back to true if we needed this fine-grained control
        onMouseLeave={() => setIsHoveringOver?.(false)}
      >
        <Button
          href={t('citePortalLink')}
          disabled={false}
          LinkComponent={Link}
          {...(buttonProps as ButtonProps)}
        >
          <span>{t('citePortal')}</span>
        </Button>
      </div>
    </Tooltip>
  )
}

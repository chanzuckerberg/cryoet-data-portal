import { useLocation } from '@remix-run/react'
import { Fragment } from 'react'

import { CZIIcon, ImageInstituteIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'

import { CryoETHomeLink } from './CryoETHomeLink'

const DEV_LINKS = [
  {
    label: i18n.github,
    href: 'https://github.com/chanzuckerberg/cryoet-data-portal',
  },
  {
    label: i18n.api,
    href: 'https://chanzuckerberg.github.io/cryoet-data-portal/stable/python-api.html',
  },
  {
    label: i18n.napariPlugin,
    href: 'https://chanzuckerberg.github.io/cryoet-data-portal/stable/cryoet_data_portal_docsite_napari.html',
  },
  {
    label: i18n.contributeData,
    href: 'https://airtable.com/apppmytRJXoXYTO9w/shr5UxgeQcUTSGyiY?prefill_Event=ContributionPortalFooter&hide_Event=true',
  },
  {
    label: i18n.feedback,
    href: 'https://airtable.com/apppmytRJXoXYTO9w/shrjmV9knAC7E7VVM?prefill_Event=FeedbackPortalFooter&hide_Event=true',
  },
  {
    label: i18n.documentation,
    href: 'https://chanzuckerberg.github.io/cryoet-data-portal/stable/index.html',
  },
]

const LEGAL_LINKS = [
  {
    label: i18n.privacy,
    href: '/privacy',
  },
  // {
  //   label: i18n.terms,
  //   href: 'https://example.com',
  // },
  // {
  //   label: i18n.license,
  //   href: 'https://example.com',
  // },
]

export function Footer() {
  const { pathname } = useLocation()

  const legalLinks = (
    <div className="flex items-center gap-sds-s">
      {LEGAL_LINKS.map(({ label, href }, idx) => (
        <Fragment key={label + href}>
          <Link
            className="text-light-sds-color-primitive-gray-50 hover:text-light-sds-color-primitive-gray-300"
            to={href}
          >
            {label}
          </Link>

          {idx !== LEGAL_LINKS.length - 1 && (
            <div className="h-sds-l w-px bg-light-sds-color-primitive-gray-300" />
          )}
        </Fragment>
      ))}
    </div>
  )

  const cziLinks = (
    <div className="flex items-center gap-sds-xl">
      <Link to="https://chanzuckerberg.com">
        <CZIIcon />
      </Link>

      <div className="h-[34px] w-px bg-light-sds-color-primitive-gray-50/30" />

      <Link to="https://www.czimaginginstitute.org/">
        <ImageInstituteIcon />
      </Link>
    </div>
  )

  const isItNeuroglancerPage = pathname.includes('/view/runs/')

  if (isItNeuroglancerPage) {
    return null
  }

  return (
    <footer className="bg-light-sds-color-primitive-gray-900  min-h-[213px] pt-[41px] pb-sds-xxl px-sds-xl screen-716:px-sds-xxl flex flex-col flex-shrink-0">
      <div className="flex items-center flex-wrap flex-col screen-716:flex-row gap-y-sds-xl screen-716:gap-y-sds-xxl">
        <CryoETHomeLink />

        <div className="flex-grow hidden screen-716:block" />

        <div
          className={cns(
            'flex flex-col screen-716:flex-row',
            'items-center gap-sds-m screen-716:gap-sds-xxl',
            'text-sds-body-s-400-wide font-semibold',
          )}
        >
          {DEV_LINKS.map(({ label, href }) => (
            <Link
              key={label + href}
              className="text-light-sds-color-primitive-gray-50 hover:text-light-sds-color-primitive-gray-300"
              to={href}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center mt-[36px] screen-716:mt-[70px] text-sds-body-s-400-wide flex-col screen-716:flex-row gap-y-sds-l screen-716:gap-y-sds-xxl">
        <div className="hidden screen-716:block">{legalLinks}</div>
        <div className="screen-716:hidden">{cziLinks}</div>

        <div className="flex-grow hidden screen-716:block" />

        <div className="screen-716:hidden">{legalLinks}</div>
        <div className="hidden screen-716:block">{cziLinks}</div>
      </div>
    </footer>
  )
}

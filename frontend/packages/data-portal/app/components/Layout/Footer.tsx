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
    href: 'https://chanzuckerberg.github.io/cryoet-data-portal/python-api.html',
  },
  {
    label: i18n.napariPlugin,
    href: 'https://chanzuckerberg.github.io/cryoet-data-portal/cryoet_data_portal_docsite_napari.html',
  },
  {
    label: i18n.documentation,
    href: 'https://chanzuckerberg.github.io/cryoet-data-portal/index.html',
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
  const legalLinks = (
    <div className="flex items-center gap-sds-s">
      {LEGAL_LINKS.map(({ label, href }, idx) => (
        <Fragment key={label + href}>
          <Link
            className="text-sds-color-primitive-common-white hover:text-sds-gray-300"
            to={href}
          >
            {label}
          </Link>

          {idx !== LEGAL_LINKS.length - 1 && (
            <div className="h-sds-l w-px bg-sds-gray-300" />
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

      <div className="h-[34px] w-px bg-sds-color-primitive-common-white/30" />

      <Link to="https://www.czimaginginstitute.org/">
        <ImageInstituteIcon />
      </Link>
    </div>
  )

  return (
    <footer className="bg-sds-color-primitive-common-black min-h-[213px] p-sds-xxl flex flex-col flex-shrink-0">
      <div className="flex items-center flex-wrap flex-col sm:flex-row sm:gap-y-sds-xxl">
        <CryoETHomeLink />

        <div className="flex-grow" />

        <div
          className={cns(
            'mt-sds-xxl sm:mt-0',
            'flex flex-col sm:flex-row',
            'items-center gap-sds-xxl',
            'text-sds-body-s font-semibold',
          )}
        >
          {DEV_LINKS.map(({ label, href }) => (
            <Link
              key={label + href}
              className="text-sds-color-primitive-common-white hover:text-sds-gray-300"
              to={href}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center mt-[70px] text-sds-body-s flex-col sm:flex-row gap-y-sds-xxl">
        <div className="hidden sm:block">{legalLinks}</div>
        <div className="sm:hidden">{cziLinks}</div>

        <div className="flex-grow" />

        <div className="sm:hidden">{legalLinks}</div>
        <div className="hidden sm:block">{cziLinks}</div>
      </div>
    </footer>
  )
}

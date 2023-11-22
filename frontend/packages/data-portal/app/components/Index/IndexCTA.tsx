import { Button } from '@czi-sds/components'

import { Link } from 'app/components/Link'

function CTA({
  title,
  text,
  buttonText,
  url,
}: {
  title: string
  text: string
  buttonText: string
  url: string
}) {
  return (
    <>
      <div className="flex flex-col gap-sds-xs">
        <h4 className="font-sds-semibold font-semibold text-sds-header-m leading-sds-header-m">
          {title}
        </h4>
        <p>{text}</p>
      </div>
      <div>
        <Link to={url}>
          <Button sdsType="primary" sdsStyle="rounded">
            {buttonText}
          </Button>
        </Link>
      </div>
    </>
  )
}

export function IndexCTA() {
  return (
    <div className="py-sds-xxl flex flex-col gap-sds-xl relative after:h-full after:w-[200vw] after:bg-sds-primary-100 after:absolute after:top-0 after:-translate-x-1/2 after:-z-10">
      <h3 className="font-sds-semibold font-semibold text-sds-header-xl leading-sds-header-xl">
        Help us achieve this vision
      </h3>
      <div className="w-full grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] grid-flow-col gap-y-sds-xl gap-x-sds-xxl">
        <CTA
          title="View and Download Datasets"
          text="Find and visualize cryoET datasets in the portal and download to use for your own work."
          buttonText="Browse Data"
          url="/browse-data/datasets"
        />
        <div className="bg-sds-gray-200 w-[2px] row-span-2" />
        <CTA
          title="Contribute your Data"
          text="We encourage you to share datasets and/or annotations to existing data. Click below to fill out the inquiry form."
          buttonText="Tell us More"
          // TODO: fill this out when form page created
          url="/"
        />
      </div>
    </div>
  )
}

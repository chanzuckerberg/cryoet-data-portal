import { Link } from 'app/components/Link'
import { CZ_URL, CZII_URL, EMPIAR_URL } from 'app/constants/external-links'

import { IndexContributors } from './IndexContributors'
import { IndexCTA } from './IndexCTA'

export function IndexContent() {
  return (
    <div className="px-sds-xl w-[100vw] overflow-x-clip flex flex-col items-center">
      <div className="flex flex-col max-w-content-small py-sds-xxl gap-sds-xxl">
        <div className="flex flex-col gap-sds-xl">
          <h2 className="font-sds-semibold font-semibold text-sds-header-xl leading-sds-header-xl">
            Welcome to the CryoET Data Portal, a project built by the{' '}
            <Link to={CZII_URL} className="text-sds-info-400">
              Chan Zuckerberg Imaging Institute
            </Link>{' '}
            and the{' '}
            <Link to={CZ_URL} className="text-sds-info-400">
              Chan Zuckerberg Initiative
            </Link>
            .
          </h2>
          <div className="font-sds-regular text-sds-body-s leading-sds-body-s flex flex-col gap-sds-l">
            <p>
              Currently, annotating tomograms from cryo-electron tomography
              (cryoET) experiments is a tedious, time-consuming, and often
              manual process. Our goal is to accelerate this process by
              catalyzing the development of sophisticated machine-learning
              methods for automatic annotation, helping researchers find
              scientific insights faster.
            </p>
            <p>
              The portal provides biologists and developers open access to
              high-quality, standardized, annotated data they can readily use to
              retrain or develop new annotation models and algorithms.
              Currently, the portal contains 13,861 tomograms from 53 datasets
              contributed by the groups of Julia Mahamid, Jürgen Plitzko, David
              Agard, John Briggs, Abhay Kotecha, Ben Engel, Danielle Grotjhan,
              and Grant Jensen.
            </p>
            <p>
              All tomograms include rich standardized metadata such as data tree
              structure and naming conventions. Most groups have already
              provided annotations for their data, and there is a structure to
              add new annotations to existing tomograms.
            </p>
            <p>
              We are actively growing the number of annotated datasets on the
              portal and encourage researchers to share their data. We are
              actively growing the number of annotated datasets on the CZ
              Imaging Institute portal and encourage researchers to share their
              data. We are working with{' '}
              <Link to={EMPIAR_URL} className="text-sds-info-400">
                EMPIAR
              </Link>{' '}
              to host the data and support annotation.
            </p>
            <p>
              Ultimately, our vision is to contribute to developing a large,
              open-access database of annotated and validated 3D structural
              information for cells that researchers can use to gain new
              insights into cellular and structural biology.
            </p>
          </div>
        </div>
        <IndexCTA />
        <IndexContributors />
        <div className="flex flex-col gap-sds-m">
          <div className="flex-initial h-sds-xxxs bg-sds-gray-200" />
          <p className="text-sds-body-xxxs leading-sds-body-xxxs text-sds-gray-600">
            Top Image: The inner workings of an algal cell as depicted with
            cryo-electron tomography, which aggregates multiple snapshots of a
            single piece of material. Visible are the Golgi apparatus (green and
            magenta), and vesicles (multi-colored circles). | Photo credit: Y.
            S. Bykkov et al./eLIFE (CC BY 4.0)
          </p>
        </div>
      </div>
    </div>
  )
}

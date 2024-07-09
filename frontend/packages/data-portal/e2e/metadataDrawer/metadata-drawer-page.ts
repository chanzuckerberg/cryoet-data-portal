import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { expect } from '@playwright/test'
import { E2E_CONFIG, translations } from 'e2e/constants'
import { PageObject } from 'e2e/page-objects/page-object'
import { isArray } from 'lodash-es'
import { DeepPartial } from 'utility-types'
import { _DeepPartialArray } from 'utility-types/dist/mapped-types'

import {
  Annotations,
  Datasets,
  Tiltseries,
  Tomograms,
} from 'app/__generated__/graphql'
import { TestIds } from 'app/constants/testIds'
import { getDatasetById } from 'app/graphql/getDatasetById.server'
import { getRunById } from 'app/graphql/getRunById.server'
import { isFiducial } from 'app/utils/tomograms'

import { DrawerTestData, DrawerTestMetadata } from './types'

export class MetadataDrawerPage extends PageObject {
  // TODO: (ehoops) Which region does this belong in?
  public getBoolString(value?: boolean): string {
    return value ? 'True' : 'False'
  }

  // #region Navigate
  // #endregion Navigate

  // #region API
  public getDatasetTestMetadata({
    dataset,
    type,
  }: {
    dataset: DeepPartial<Datasets>
    type: 'dataset' | 'run'
  }): DrawerTestMetadata {
    return {
      cellLineOrStrainName: dataset.cell_strain_name,
      cellName: dataset.cell_name,
      cellularComponent: dataset.cell_component_name,
      citations: dataset.dataset_citations?.split(', ') ?? [],
      depositionDate: dataset.deposition_date,
      fundingAgency: dataset?.funding_sources?.map(
        (source) => source?.funding_agency_name ?? '',
      ),
      grantID: dataset.funding_sources?.map((source) => source.grant_id ?? ''),
      gridPreparation: dataset.grid_preparation,
      organismName: dataset.organism_name,
      otherSetup: dataset.other_setup,
      relatedDatabases: dataset.related_database_entries?.split(', ') ?? [],
      samplePreparation: dataset.sample_preparation,
      sampleType: dataset.sample_type,
      tissueName: dataset.tissue_name,

      ...(type === 'run'
        ? {
            description: dataset.description,
            depositionDate: dataset.deposition_date,
            releaseDate: dataset.release_date,
            lastModifiedDate: dataset.last_modified_date,
            authors: dataset.authors?.map((author) => author.name),
          }
        : {}),
    }
  }

  public getTiltSeriesTestMetadata({
    tiltSeries,
    type,
  }: {
    tiltSeries: DeepPartial<Tiltseries>
    type: 'dataset' | 'run'
  }): DrawerTestMetadata {
    return {
      accelerationVoltage: tiltSeries.acceleration_voltage,
      sphericalAberrationConstant: tiltSeries.spherical_aberration_constant,
      microscopeManufacturer: tiltSeries.microscope_manufacturer,
      microscopeModel: tiltSeries.microscope_model,
      energyFilter: tiltSeries.microscope_energy_filter,
      phasePlate: tiltSeries.microscope_phase_plate,
      imageCorrector: tiltSeries.microscope_image_corrector ?? 'None',
      additionalMicroscopeOpticalSetup:
        tiltSeries.microscope_additional_info ?? 'None',
      cameraManufacturer: tiltSeries.camera_manufacturer,
      cameraModel: tiltSeries.camera_model,

      ...(type === 'run'
        ? {
            dataAcquisitionSoftware: tiltSeries.data_acquisition_software,
            pixelSpacing: tiltSeries.pixel_spacing,
            tiltAxis: tiltSeries.tilt_axis,
            tiltRange: tiltSeries.tilt_range,
            tiltStep: tiltSeries.tilt_step,
            tiltingScheme: tiltSeries.tilting_scheme,
            totalFlux: tiltSeries.total_flux,
            bingingFromFrames: tiltSeries.binning_from_frames,
            seriesIsAligned: this.getBoolString(tiltSeries.is_aligned),
            relatedEmpiarEntry: tiltSeries.related_empiar_entry,
          }
        : {}),
    }
  }

  public getTomogramTestMetadata(
    tomogram: DeepPartial<Tomograms>,
  ): DrawerTestMetadata {
    return {
      reconstructionSoftware: tomogram.reconstruction_software,
      reconstructionMethod: tomogram.reconstruction_method,
      processingSoftware: tomogram.processing_software,
      availableProcessing: tomogram.processing,
      smallestAvailableVoxelSpacing: tomogram.voxel_spacing,
      size: `${tomogram.size_x}, ${tomogram.size_y}, ${tomogram.size_z}`,
      fiducialAlignmentStatus: this.getBoolString(
        isFiducial(tomogram.fiducial_alignment_status),
      ),
      ctfCorrected: tomogram.ctf_corrected ? 'Yes' : 'No',
    }
  }

  public getAnnotationTestMetdata(
    annotation: DeepPartial<Annotations>,
  ): DrawerTestMetadata {
    const file = (annotation.files ?? []).at(0)

    return {
      annotationId: annotation.id,
      annotationAuthors: annotation.authors?.map((author) => author.name),
      publication: annotation.annotation_publication,
      depositionDate: annotation.deposition_date,
      lastModifiedDate: annotation.last_modified_date,
      releaseDate: annotation.release_date,
      methodType: annotation.method_type,
      annotationMethod: annotation.annotation_method,
      annotationSoftware: annotation.annotation_software,
      objectName: annotation.object_name,
      goId: annotation.object_id,
      objectCount: annotation.object_count,
      objectShapeType: file?.shape_type,
      objectState: annotation.object_state,
      objectDescription: annotation.object_description,
      groundTruthStatus: this.getBoolString(annotation.ground_truth_status),
      groundTruthUsed: annotation.ground_truth_used,
      precision: annotation.confidence_precision,
      recall: annotation.confidence_recall,
    }
  }

  public async getSingleDatasetTestMetadata(
    client: ApolloClient<NormalizedCacheObject>,
  ): Promise<DrawerTestData> {
    const { data } = await getDatasetById({
      client,
      id: +E2E_CONFIG.datasetId,
    })

    const [dataset] = data.datasets
    const [tiltSeries] = dataset.run_metadata[0].tiltseries

    return {
      title: dataset.title,
      metadata: {
        ...this.getDatasetTestMetadata({
          dataset,
          type: 'dataset',
        }),

        ...this.getTiltSeriesTestMetadata({
          tiltSeries,
          type: 'dataset',
        }),
      },
    }
  }

  public async getSingleRunTestMetadata(
    client: ApolloClient<NormalizedCacheObject>,
  ): Promise<DrawerTestData> {
    const { data } = await getRunById({
      client,
      id: +E2E_CONFIG.runId,
    })

    const [run] = data.runs
    const [tiltSeries] = run.tiltseries
    const [tomogram] = run.tomogram_voxel_spacings[0].tomograms

    return {
      title: run.name,
      metadata: {
        ...this.getDatasetTestMetadata({
          dataset: run.dataset,
          type: 'run',
        }),

        ...this.getTiltSeriesTestMetadata({
          tiltSeries,
          type: 'run',
        }),

        ...this.getTomogramTestMetadata(tomogram),
      },
    }
  }

  public async getAnnotationTestMetadata(
    client: ApolloClient<NormalizedCacheObject>,
  ) {
    const { data } = await getRunById({
      client,
      id: +E2E_CONFIG.runId,
    })

    const [run] = data.runs
    const annotation = run.annotation_table[0].annotations[0]

    return {
      title: `${annotation.id} - ${annotation.object_name}`,
      metadata: this.getAnnotationTestMetdata(annotation),
    }
  }
  // #endregion API

  // #region Click
  public async openViewAllInfoDrawer() {
    await this.page
      .getByRole('button', { name: translations.viewAllInfo })
      .click()
  }

  public async openInfoDrawer() {
    await this.page
      .getByRole('button', { name: translations.info, exact: true })
      .first()
      .click()
  }

  public async closeMetadataDrawer() {
    await this.getCloseButton().click()
  }

  public async expandFirstAccordion() {
    await this.getMetadataDrawer()
      .getByRole('button', { expanded: false })
      .first()
      .click()
  }
  // #endregion Click

  // #region Hover
  // #endregion Hover

  // #region Get
  private getMetadataDrawer() {
    return this.page.getByTestId(TestIds.MetadataDrawer)
  }

  public getCloseButton() {
    return this.page.getByTestId(TestIds.MetadataDrawerCloseButton)
  }

  public async getNumberOfAccordions() {
    return this.getMetadataDrawer()
      .getByRole('button', { expanded: false })
      .count()
  }

  private getMetadataCells(label: string) {
    return this.getMetadataDrawer().locator(`tr:has-text("${label}") td`)
  }
  // #endregion Get

  // #region Macro
  public async waitForMetadataDrawerToBeVisible() {
    await this.getMetadataDrawer().waitFor({ state: 'visible' })
  }

  public async expandAllAccordions() {
    const nUnexpandedAccordions = await this.getNumberOfAccordions()

    // We expand the accordions one by one because clicking on all of them
    // programatically will break playwright. Assume the Playwright locator
    // finds two accordions and stores their locator nodes in 0 and 1. If we
    // click on 0, the node is changed to have the attribute expanded=true,
    // resulting in the locator updating and changing the node in 1 to 0.
    //
    // To get around this, we get a count of unexpanded accordions and click
    // on the first accordion we find in the drawer.
    for (let i = 0; i < nUnexpandedAccordions; i += 1) {
      await this.expandFirstAccordion()
    }
  }
  // #endregion Macro

  // #region Validation
  public async expectMetadataDrawerToBeVisible() {
    await expect(this.getMetadataDrawer()).toBeVisible()
  }

  public async expectMetadataDrawerToBeHidden() {
    await expect(this.getMetadataDrawer()).toBeHidden()
  }

  public async expectMetadataDrawerToShowTitle(text: string) {
    await expect(this.getMetadataDrawer()).toContainText(text)
  }

  public async expectMetadataTableCellToDisplayList(
    label: string,
    value: _DeepPartialArray<string>,
  ) {
    const cells = this.getMetadataCells(label)
    const nodeValue = await cells.last().innerText()
    expect(
      value.every((v) => nodeValue.includes(v ?? '')),
      `Test for ${label} with value ${nodeValue} to include ${value.join(
        ', ',
      )}`,
    ).toBe(true)
  }

  public async expectMetadataTableCellToDisplayValue(
    label: string,
    value: string | number,
  ) {
    const cells = this.getMetadataCells(label)

    await expect(
      cells.last(),
      `Test for ${label} to have value ${value}`,
    ).toContainText(`${value}`)
  }

  public async expectMetadataTableCellToDisplayNotApplicable(label: string) {
    const cells = this.getMetadataCells(label)

    await expect(
      cells.last(),
      `Test for ${label} to be "Not Applicable"`,
    ).toContainText('Not Applicable')
  }

  public async expectMetadataTableCellToDisplayEmpty(label: string) {
    const cells = this.getMetadataCells(label)

    await expect(cells.last(), `Test for ${label} to be empty`).toContainText(
      '--',
    )
  }

  public async expectMetadataTableCellsToDisplayValues(data: DrawerTestData) {
    for (const [key, value] of Object.entries(data.metadata)) {
      const label = translations[key as keyof typeof translations]

      // Array:
      if (isArray(value)) {
        await this.expectMetadataTableCellToDisplayList(label, value)
        continue
      }
      // String or Number:
      if (value !== null) {
        await this.expectMetadataTableCellToDisplayValue(label, value)
        continue
      }
      // Empty because N/A:
      if (
        data.metadata.groundTruthStatus &&
        ['groundTruthUsed', 'precision', 'recall'].includes(key)
      ) {
        await this.expectMetadataTableCellToDisplayNotApplicable(label)
        continue
      }
      await this.expectMetadataTableCellToDisplayEmpty(label)
    }
  }
  // #endregion Validation

  // #region Bool
  // #endregion Bool
}

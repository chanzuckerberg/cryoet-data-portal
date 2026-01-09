# Download Modal

This document describes the download modal pattern used for configuring and initiating data downloads throughout the CryoET Data Portal.


## Quick Reference

| Component                           | Purpose                   | Location                                                                                                              |
| ----------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `<DownloadModal>`                   | Main modal component      | [`components/Download/DownloadModal.tsx`](../../../packages/data-portal/app/components/Download/DownloadModal.tsx)       |
| `useDownloadModalQueryParamState()` | State management hook     | [`hooks/useDownloadModalQueryParamState.ts`](../../../packages/data-portal/app/hooks/useDownloadModalQueryParamState.ts) |
| `DownloadModalContext`              | Context for download data | [`context/DownloadModal.context.ts`](../../../packages/data-portal/app/context/DownloadModal.context.ts)                 |

---

## Architecture Overview

The download modal provides a multi-step configuration flow for downloading datasets, runs, and annotations:

```
Step 1: Configure           Step 2: Download Options
┌────────────────────┐      ┌────────────────────┐
│ Select Format      │  →   │ AWS CLI            │
│ Choose Processing  │      │ API                │
│ Pick Files         │      │ cURL               │
└────────────────────┘      │ Direct Download    │
                            └────────────────────┘
```

### Download Types

| Type       | Steps | Configuration Options               |
| ---------- | ----- | ----------------------------------- |
| Dataset    | 1     | None - direct to download options   |
| Run        | 2     | Select tomogram processing/sampling |
| Annotation | 2     | Choose file format and alignment    |

---

## Basic Usage

### Opening the Modal

```typescript
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'

function DatasetRow({ dataset }: Props) {
  const { openDatasetDownloadModal } = useDownloadModalQueryParamState()

  return (
    <Button
      onClick={() =>
        openDatasetDownloadModal({
          datasetId: dataset.id,
          fileSize: dataset.size,
        })
      }
    >
      Download
    </Button>
  )
}
```

### Rendering the Modal

```typescript
<DownloadModal
  type="dataset"
  datasetId={dataset.id}
  datasetTitle={dataset.title}
  s3Path={dataset.s3_prefix}
  httpsPath={dataset.https_prefix}
/>
```

**Location:** [`routes/datasets.$id.tsx`](../../../packages/data-portal/app/routes/datasets.$id.tsx)

---

## State Management

### useDownloadModalQueryParamState Hook

Manages modal state via URL query parameters:

```typescript
export function useDownloadModalQueryParamState() {
  return {
    // State
    isModalOpen: boolean
    downloadStep: DownloadStep | null
    downloadTab: DownloadTab | null
    downloadConfig: DownloadConfig | null
    tomogramProcessing: string | null
    tomogramSampling: string | null
    annotationId: string | null
    fileFormat: string | null

    // Open methods
    openDatasetDownloadModal: (payload) => void
    openRunDownloadModal: (payload) => void
    openAnnotationDownloadModal: (payload) => void
    openTomogramDownloadModal: (payload) => void

    // Navigation methods
    configureDownload: (payload) => void
    goBackToConfigure: (payload) => void
    closeDownloadModal: (payload) => void

    // Update methods
    setDownloadTab: (payload) => void
    setDownloadConfig: (config) => void
    setTomogramConfig: (id?) => void
    setAllAnnotationsConfig: () => void
  }
}
```

**Location:** [`hooks/useDownloadModalQueryParamState.ts`](../../../packages/data-portal/app/hooks/useDownloadModalQueryParamState.ts)

### Download Steps

```typescript
export enum DownloadStep {
  Configure = 'configure',
  Download = 'download',
}
```

### Download Tabs

```typescript
export enum DownloadTab {
  API = 'api',
  AWS = 'aws',
  Curl = 'curl',
  Direct = 'direct',
}
```

### Download Config

```typescript
export enum DownloadConfig {
  AllAnnotations = 'all-annotations',
  Tomogram = 'tomogram',
}
```

---

## DownloadModalContext

### Context Interface

```typescript
export interface DownloadModalContextValue {
  // Type of download
  type: 'dataset' | 'runs' | 'annotation'

  // Dataset information
  datasetId?: number
  datasetTitle?: string
  datasetContentsSummary?: SummaryData

  // Run information
  runId?: number
  runName?: string
  totalRuns?: number

  // Tomogram information
  tomogramId?: number
  allTomograms?: TomogramV2[]
  allTomogramProcessing?: string[]
  tomogramToDownload?: TomogramV2

  // Annotation information
  annotationShapeToDownload?: AnnotationShape
  allAnnotationShapes?: AnnotationShape[]
  objectName?: string

  // Download paths
  s3Path?: string
  httpsPath?: string

  // Metadata
  fileSize?: number
}
```

**Location:** [`context/DownloadModal.context.ts`](../../../packages/data-portal/app/context/DownloadModal.context.ts)

### Using the Context

```typescript
import { useDownloadModalContext } from 'app/context/DownloadModal.context'

function ConfigureDownloadContent() {
  const { type, datasetId, runName, allTomograms } = useDownloadModalContext()

  // Access modal context data
}
```

---

## Modal Structure

### Two-Step Flow

```typescript
const modalData = useMemo(() => {
  const hasMultipleSteps = ['runs', 'annotation'].includes(type)

  return match({ downloadStep, type })
    .with(
      { type: 'dataset' },
      { type: 'runs', downloadStep: DownloadStep.Download },
      { type: 'annotation', downloadStep: DownloadStep.Download },
      () => ({
        // Step 2: Download Options
        buttonText: t('close'),
        content: <DownloadOptionsContent />,
        onClick: closeModal,
        showBackButton: hasMultipleSteps,
        subtitle: hasMultipleSteps ? t('stepCount', { count: 2, max: 2 }) : null,
        title: type === 'dataset' ? t('downloadDatasetTitle') : t('downloadOptions'),
      }),
    )
    .otherwise(() => ({
      // Step 1: Configure
      buttonDisabled: !downloadConfig,
      buttonText: t('next'),
      content: <ConfigureDownloadContent />,
      onClick: () => configureDownload(plausiblePayload),
      showBackButton: false,
      subtitle: t('stepCount', { count: 1, max: 2 }),
      title: t('configureDownload'),
    }))
}, [downloadStep, type, downloadConfig, ...])
```

**Location:** [`components/Download/DownloadModal.tsx`](../../../packages/data-portal/app/components/Download/DownloadModal.tsx)

---

## Configuration Step

### For Runs (Tomogram Selection)

```typescript
function ConfigureTomogramDownloadContent() {
  const { allTomograms } = useDownloadModalContext()
  const { setTomogramConfig } = useDownloadModalQueryParamState()

  return (
    <div className="flex flex-col gap-sds-l">
      <p>{t('selectTomogramToDownload')}</p>

      <TomogramSelector
        tomograms={allTomograms}
        onSelect={(tomogramId) => setTomogramConfig(tomogramId)}
      />
    </div>
  )
}
```

**Location:** [`components/Download/ConfigureTomogramDownloadContent.tsx`](../../../packages/data-portal/app/components/Download/ConfigureTomogramDownloadContent.tsx)

### For Annotations (Format Selection)

```typescript
function ConfigureAnnotationDownloadContent() {
  const { allAnnotationShapes } = useDownloadModalContext()
  const { setFileFormat } = useDownloadModalQueryParamState()

  return (
    <div className="flex flex-col gap-sds-l">
      <FileFormatDropdown
        formats={getAvailableFormats(allAnnotationShapes)}
        onSelect={setFileFormat}
      />

      <AnnotationAlignmentCallout />
    </div>
  )
}
```

**Location:** [`components/Download/ConfigureAnnotationDownloadContent.tsx`](../../../packages/data-portal/app/components/Download/ConfigureAnnotationDownloadContent.tsx)

---

## Download Options Step

### Tab Navigation

```typescript
function DownloadOptionsContent() {
  const { downloadTab, setDownloadTab } = useDownloadModalQueryParamState()

  return (
    <>
      <Tabs
        value={downloadTab ?? DownloadTab.AWS}
        onChange={(tab) => setDownloadTab({ tab })}
        tabs={[
          { label: 'AWS', value: DownloadTab.AWS },
          { label: 'API', value: DownloadTab.API },
          { label: 'cURL', value: DownloadTab.Curl },
          { label: 'Direct Download', value: DownloadTab.Direct },
        ]}
      />

      {downloadTab === DownloadTab.AWS && <AWSDownloadTab />}
      {downloadTab === DownloadTab.API && <APIDownloadTab />}
      {downloadTab === DownloadTab.Curl && <CurlDownloadTab />}
      {downloadTab === DownloadTab.Direct && <DirectDownloadTab />}
    </>
  )
}
```

**Location:** [`components/Download/DownloadOptionsContent.tsx`](../../../packages/data-portal/app/components/Download/DownloadOptionsContent.tsx)

---

## Download Tabs

### AWS CLI Tab

```typescript
function AWSDownloadTab() {
  const { s3Path } = useDownloadModalContext()
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-sds-l">
      <p>{t('awsInstructions')}</p>

      <CopyBox
        content={`aws s3 cp --recursive ${s3Path} ./destination/`}
        label="AWS CLI Command"
      />

      <Link to={t('awsCliLink')} target="_blank">
        {t('installAwsCli')}
      </Link>
    </div>
  )
}
```

**Location:** [`components/Download/AWSDownloadTab.tsx`](../../../packages/data-portal/app/components/Download/AWSDownloadTab.tsx)

### API Tab

```typescript
function APIDownloadTab() {
  const { datasetId } = useDownloadModalContext()
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-sds-l">
      <p>{t('apiInstructions')}</p>

      <CopyBox
        content={`
from cryoet_data_portal import Dataset

dataset = Dataset.get_by_id(${datasetId})
dataset.download()
        `.trim()}
        language="python"
      />

      <Link to={t('apiDocLink')} target="_blank">
        {t('viewApiDocs')}
      </Link>
    </div>
  )
}
```

**Location:** [`components/Download/APIDownloadTab.tsx`](../../../packages/data-portal/app/components/Download/APIDownloadTab.tsx)

### cURL Tab

```typescript
function CurlDownloadTab() {
  const { httpsPath } = useDownloadModalContext()

  return (
    <div className="flex flex-col gap-sds-l">
      <p>{t('curlInstructions')}</p>

      <CopyBox
        content={`curl -O ${httpsPath}`}
        label="cURL Command"
      />
    </div>
  )
}
```

**Location:** [`components/Download/CurlDownloadTab.tsx`](../../../packages/data-portal/app/components/Download/CurlDownloadTab.tsx)

### Direct Download Tab

```typescript
function DirectDownloadTab() {
  const { httpsPath, fileSize } = useDownloadModalContext()
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-sds-l items-center">
      <p className="text-center">
        {t('directDownloadDescription')}
      </p>

      <Button
        component="a"
        href={httpsPath}
        download
        sdsType="primary"
      >
        {t('clickToDownloadViaBrowser')}
      </Button>

      {fileSize && (
        <p className="text-sds-body-s-400-wide text-light-sds-color-primitive-gray-500">
          {t('fileSize')}: {formatFileSize(fileSize)}
        </p>
      )}
    </div>
  )
}
```

**Location:** [`components/Download/DirectDownloadTab.tsx`](../../../packages/data-portal/app/components/Download/DirectDownloadTab.tsx)

---

## Analytics Integration

### Tracked Events

All modal interactions are tracked via Plausible:

```typescript
// Opening modal
plausible(Events.OpenDownloadModal, {
  datasetId,
  runId,
  fileSize,
  step: DownloadStep.Configure,
})

// Progressing to download options
plausible(Events.ClickNextToDownloadOptions, {
  datasetId,
  config: downloadConfig,
  tomogramProcessing,
  tomogramSampling,
})

// Switching tabs
plausible(Events.ClickDownloadTab, {
  tab: DownloadTab.AWS,
  datasetId,
})

// Closing modal
plausible(Events.CloseDownloadModal, {
  datasetId,
  step: downloadStep,
})
```

### Payload Structure

```typescript
export type PlausibleDownloadModalPayload = {
  datasetId?: number
  runId?: number
  fileSize?: number
  tomogramProcessing?: string
  tomogramSampling?: string
  annotationId?: string
  objectShapeType?: string
  step?: DownloadStep
  config?: DownloadConfig
  tab?: DownloadTab
  fileFormat?: string
}
```

---

## Special Features

### Annotation Alignment Warning

```typescript
function AnnotationAlignmentCallout() {
  const { t } = useI18n()

  return (
    <Callout intent="warning">
      <p>{t('annotationsMayRequireTransformation')}</p>
      <Link to="https://docs.portal.com/annotations" target="_blank">
        {t('learnAboutAnnotationTransformation')}
      </Link>
    </Callout>
  )
}
```

**Purpose:** Warn users that annotations may need transformation if used with different tomogram alignments.

**Location:** [`components/Download/AnnotationAlignmentCallout.tsx`](../../../packages/data-portal/app/components/Download/AnnotationAlignmentCallout.tsx)

### Tomogram Selector

```typescript
function TomogramSelector({ tomograms, onSelect }: Props) {
  const [selectedId, setSelectedId] = useState<string>()

  return (
    <Select
      value={selectedId}
      onChange={(id) => {
        setSelectedId(id)
        onSelect(id)
      }}
    >
      {tomograms.map((tomogram) => (
        <MenuItem key={tomogram.id} value={String(tomogram.id)}>
          <TomogramSelectorLabel tomogram={tomogram} />
        </MenuItem>
      ))}
    </Select>
  )
}
```

Shows tomogram details (processing, sampling, size) in dropdown.

**Location:** [`components/Download/Tomogram/TomogramSelector.tsx`](../../../packages/data-portal/app/components/Download/Tomogram/TomogramSelector.tsx)

---

## Best Practices

### Do's

✅ **Provide context in the modal**

```typescript
<DownloadModal
  type="dataset"
  datasetTitle="Clear, descriptive title"
  fileSize={12345678} // Show file size
/>
```

✅ **Track all user interactions**

```typescript
// Log when users configure downloads
plausible(Events.ClickNextToDownloadOptions, payload)
```

✅ **Validate before advancing steps**

```typescript
buttonDisabled={!downloadConfig || !fileFormat}
```

### Don'ts

❌ **Don't forget to clean up URL params**

```typescript
// Close should clear all download params
closeDownloadModal() {
  setDownloadParams(null) // Clear all
}
```

❌ **Don't mix modal types**

```typescript
// Each modal should handle one download type
<DownloadModal type="dataset" {...datasetProps} />
<DownloadModal type="annotation" {...annotationProps} />
// Not: <DownloadModal type="dataset-and-annotation" />
```

❌ **Don't skip loading states**

```typescript
{isLoadingTomograms ? (
  <Skeleton />
) : (
  <TomogramSelector tomograms={tomograms} />
)}
```

---

## Error Handling

### Missing Required Data

```typescript
function DownloadModal({ type, datasetId }: Props) {
  if (type === 'dataset' && !datasetId) {
    console.error('datasetId required for dataset downloads')
    return null
  }

  // ... rest of component
}
```

### Download Failures

```typescript
try {
  await downloadFile(url)
} catch (error) {
  showNotification({
    message: t('downloadFailed'),
    type: 'error',
  })
}
```

## Next Steps

- [Table Page Layout](./02-table-page-layout.md) - Integrating modals with pages
- [Component Architecture](./01-component-architecture.md) - Component structure
- [Hooks Guide](../06-cross-cutting/03-hooks-guide.md) - Understanding custom hooks

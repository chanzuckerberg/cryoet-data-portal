# Download Modal

The download modal guides users through configuring and initiating data downloads. It presents multiple download methods (AWS CLI, Python API, cURL, direct browser download) and, for complex downloads like runs or annotations, includes a configuration step to select specific files or formats.

## Quick Reference

| Component                           | Purpose                   | Location                                                                                                                 |
| ----------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `<DownloadModal>`                   | Main modal component      | [`components/Download/DownloadModal.tsx`](../../../packages/data-portal/app/components/Download/DownloadModal.tsx)       |
| `useDownloadModalQueryParamState()` | State management hook     | [`hooks/useDownloadModalQueryParamState.ts`](../../../packages/data-portal/app/hooks/useDownloadModalQueryParamState.ts) |
| `DownloadModalContext`              | Context for download data | [`context/DownloadModal.context.ts`](../../../packages/data-portal/app/context/DownloadModal.context.ts)                 |

---

## Architecture Overview

The modal supports three download types, each with different configuration needs:

| Type       | Flow                                | Configuration Options               |
| ---------- | ----------------------------------- | ----------------------------------- |
| Dataset    | Single step → download options      | None (direct download)              |
| Run        | Configure → download options        | Select tomogram processing/sampling |
| Annotation | Configure → download options        | Choose file format and alignment    |

```
Step 1: Configure           Step 2: Download Options
┌────────────────────┐      ┌────────────────────┐
│ Select Format      │  →   │ AWS CLI            │
│ Choose Processing  │      │ API                │
│ Pick Files         │      │ cURL               │
└────────────────────┘      │ Direct Download    │
                            └────────────────────┘
```

Dataset downloads skip the configuration step since they download the entire dataset. Run and annotation downloads require users to specify what to download before seeing download instructions.

---

## Basic Usage

### Opening the Modal

Use the `useDownloadModalQueryParamState` hook to open the modal with appropriate context:

```typescript
const { openDatasetDownloadModal } = useDownloadModalQueryParamState()

<Button onClick={() => openDatasetDownloadModal({ datasetId: 123, fileSize: 456789 })}>
  Download
</Button>
```

Different openers exist for each download type: `openDatasetDownloadModal`, `openRunDownloadModal`, `openAnnotationDownloadModal`, and `openTomogramDownloadModal`.

### Rendering the Modal

Place the modal at the page level, typically via `TablePageLayout`'s `downloadModal` prop:

```typescript
<DownloadModal
  type="dataset"
  datasetId={dataset.id}
  datasetTitle={dataset.title}
  s3Path={dataset.s3_prefix}
  httpsPath={dataset.https_prefix}
/>
```

**Example:** [`routes/datasets.$id.tsx`](../../../packages/data-portal/app/routes/datasets.$id.tsx)

---

## State Management

The hook manages modal state via URL query parameters, making download flows bookmarkable and shareable.

### Key State Values

| State                | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `isModalOpen`        | Whether the modal is currently displayed         |
| `downloadStep`       | Current step (`configure` or `download`)         |
| `downloadTab`        | Active download method tab                       |
| `downloadConfig`     | Selected configuration (`tomogram` or `all-annotations`) |
| `tomogramProcessing` | Selected tomogram processing type                |
| `tomogramSampling`   | Selected tomogram sampling rate                  |
| `annotationId`       | Selected annotation ID                           |
| `fileFormat`         | Selected annotation file format                  |

### Navigation Methods

| Method                | Purpose                                |
| --------------------- | -------------------------------------- |
| `configureDownload()` | Advance from configure to download step |
| `goBackToConfigure()` | Return to configuration step           |
| `closeDownloadModal()`| Close and reset modal state            |
| `setDownloadTab()`    | Switch between download method tabs    |

**Location:** [`hooks/useDownloadModalQueryParamState.ts`](../../../packages/data-portal/app/hooks/useDownloadModalQueryParamState.ts)

---

## Download Modal Context

The `DownloadModalContext` provides data to child components without prop drilling. It contains information about the entity being downloaded (dataset, run, tomogram, or annotation) along with available options and paths.

Key fields include:
- **Entity info**: `datasetId`, `datasetTitle`, `runId`, `runName`, `tomogramId`, `annotationId`
- **Available options**: `allTomograms`, `allTomogramProcessing`, `allAnnotationShapes`
- **Selected items**: `tomogramToDownload`, `annotationShapeToDownload`
- **Download paths**: `s3Path`, `httpsPath`
- **Metadata**: `fileSize`, `objectName`

Access via `useDownloadModalContext()` in any component within the modal.

**Location:** [`context/DownloadModal.context.ts`](../../../packages/data-portal/app/context/DownloadModal.context.ts)

---

## Configuration Step

The configuration step appears for runs and annotations, allowing users to specify exactly what to download.

### Tomogram Configuration (Runs)

Users select from available tomograms based on processing type and sampling rate. The `TomogramSelector` dropdown displays details about each option (processing method, voxel spacing, file size).

### Annotation Configuration

Users choose the file format for annotation download. A warning callout reminds users that annotations may need transformation if used with different tomogram alignments.

The "Next" button remains disabled until a valid configuration is selected.

---

## Download Options Step

Once configured (or immediately for datasets), users see four download method tabs:

### AWS CLI

Provides a copyable `aws s3 cp` command for downloading via Amazon's CLI tool. Best for large downloads and programmatic access. Includes a link to AWS CLI installation instructions.

### API (Python)

Shows Python code using the `cryoet_data_portal` library. This is the recommended approach for researchers who want to integrate downloads into analysis scripts. Links to API documentation.

### cURL

Provides a copyable `curl` command for command-line downloads via HTTPS. Useful for environments where AWS CLI isn't available.

### Direct Download

A browser-based download button for the HTTPS URL. Suitable for smaller files. Displays the file size to help users decide if browser download is appropriate.

---

## Analytics Integration

All modal interactions are tracked via Plausible analytics to understand usage patterns:

- **Modal opens**: Which download types are most used
- **Step progression**: How often users complete configuration
- **Tab selection**: Which download methods are preferred
- **Modal closes**: At which step users abandon the flow

This data informs UX improvements and documentation priorities.

---

## Special Features

### Annotation Alignment Warning

When downloading annotations, a callout warns that annotations may require transformation to align with different tomogram reconstructions. This links to documentation explaining the coordinate transformation process.

### Tomogram Selector

The dropdown displays rich information about each tomogram option:
- Processing method (e.g., "WBP", "SIRT")
- Voxel spacing
- File size

This helps users choose the appropriate tomogram for their needs.

---

## Best Practices

**Do:**
- Provide clear context (title, file size) when opening the modal
- Track user interactions for analytics
- Validate configuration before enabling the "Next" button
- Clean up URL parameters when closing the modal

**Don't:**
- Mix modal types (each modal handles one download type)
- Skip loading states when fetching available options
- Forget to handle missing required data gracefully

---

## Error Handling

The modal validates required data on render. If essential information (like `datasetId` for dataset downloads) is missing, the modal logs an error and renders nothing. Download failures should show user-friendly notifications guiding users to retry or use an alternative method.

## Next Steps

- [Table Page Layout](./02-table-page-layout.md) - Integrating modals with pages
- [Component Architecture](./01-component-architecture.md) - Component structure
- [Hooks Guide](../06-cross-cutting/03-hooks-guide.md) - Understanding custom hooks

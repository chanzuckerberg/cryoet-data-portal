import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import React from 'react'

import type {
  GetDepositionAnnoRunsForDatasetQuery,
  GetDepositionTomoRunsForDatasetQuery,
} from 'app/__generated_v2__/graphql'
import { MockI18n } from 'app/components/I18n.mock'
import { MAX_PER_ACCORDION_GROUP } from 'app/constants/pagination'
import { DataContentsType } from 'app/types/deposition-queries'

import type { RowRenderProps } from './LocationTable'

// Mock data for the hook response
const mockAnnotationRunsData: GetDepositionAnnoRunsForDatasetQuery = {
  __typename: 'Query',
  runs: [
    {
      __typename: 'Run',
      id: 1,
      name: 'run1',
      annotationsAggregate: {
        __typename: 'AnnotationAggregate',
        aggregate: [{ __typename: 'AnnotationAggregateFunctions', count: 5 }],
      },
    },
    {
      __typename: 'Run',
      id: 2,
      name: 'run2',
      annotationsAggregate: {
        __typename: 'AnnotationAggregate',
        aggregate: [{ __typename: 'AnnotationAggregateFunctions', count: 3 }],
      },
    },
  ],
  runsAggregate: {
    __typename: 'RunAggregate',
    aggregate: [{ __typename: 'RunAggregateFunctions', count: 2 }],
  },
  annotationShapesAggregate: {
    __typename: 'AnnotationShapeAggregate',
    aggregate: [
      {
        __typename: 'AnnotationShapeAggregateFunctions',
        count: 10,
        groupBy: {
          __typename: 'AnnotationShapeGroupByOptions',
          annotation: {
            __typename: 'AnnotationGroupByOptions',
            run: { __typename: 'RunGroupByOptions', id: 1 },
          },
        },
      },
      {
        __typename: 'AnnotationShapeAggregateFunctions',
        count: 15,
        groupBy: {
          __typename: 'AnnotationShapeGroupByOptions',
          annotation: {
            __typename: 'AnnotationGroupByOptions',
            run: { __typename: 'RunGroupByOptions', id: 2 },
          },
        },
      },
    ],
  },
}

const mockTomogramRunsData: GetDepositionTomoRunsForDatasetQuery = {
  __typename: 'Query',
  runs: [
    {
      __typename: 'Run',
      id: 3,
      name: 'tomo-run1',
      tomogramsAggregate: {
        __typename: 'TomogramAggregate',
        aggregate: [{ __typename: 'TomogramAggregateFunctions', count: 8 }],
      },
    },
    {
      __typename: 'Run',
      id: 4,
      name: 'tomo-run2',
      tomogramsAggregate: {
        __typename: 'TomogramAggregate',
        aggregate: [{ __typename: 'TomogramAggregateFunctions', count: 12 }],
      },
    },
  ],
  runsAggregate: {
    __typename: 'RunAggregate',
    aggregate: [{ __typename: 'RunAggregateFunctions', count: 2 }],
  },
}

// Mock the useDepositionRunsForDataset hook
const mockHookReturn = {
  data: null as
    | GetDepositionAnnoRunsForDatasetQuery
    | GetDepositionTomoRunsForDatasetQuery
    | null,
  isLoading: false,
  error: null as Error | null,
}

const mockUseDepositionRunsForDataset = jest.fn(() => mockHookReturn)

jest.unstable_mockModule('app/queries/useDepositionRunsForDataset', () => ({
  __esModule: true,
  useDepositionRunsForDataset: mockUseDepositionRunsForDataset,
}))

// Mock UI components
jest.unstable_mockModule('@czi-sds/components', () => ({
  Table: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => <table className={className}>{children}</table>,
  TableHeader: ({ children }: { children: React.ReactNode }) => (
    <thead>{children}</thead>
  ),
  CellComponent: ({
    children,
    colSpan,
    className,
  }: {
    children: React.ReactNode
    colSpan?: number
    className?: string
  }) => (
    <td colSpan={colSpan} className={className}>
      {children}
    </td>
  ),
  TableRow: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => <tr className={className}>{children}</tr>,
}))

jest.unstable_mockModule('@mui/material/TableContainer', () => ({
  __esModule: true,
  default: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => <div className={className}>{children}</div>,
}))

jest.unstable_mockModule('@mui/material/Skeleton', () => ({
  __esModule: true,
  default: ({
    width,
    height,
  }: {
    width?: number | string
    height?: number | string
  }) => <div data-testid="skeleton" style={{ width, height }} />,
}))

jest.unstable_mockModule('app/components/I18n', () => ({ I18n: MockI18n }))

const baseProps = {
  runPagination: { 'Test Dataset': { run1: 1, run2: 2 } },
  expandedRuns: { 'Test Dataset': { run1: false, run2: true } },
  onRunToggle: jest.fn(),
  onRunPageChange: jest.fn(),
  depositionId: 123,
  datasetId: 456,
  datasetTitle: 'Test Dataset',
  isExpanded: false,
  currentGroupPage: 1,
}

const mockTableHeaders = (
  <tr>
    <th>Run Name</th>
    <th>Count</th>
  </tr>
)

const mockRenderRow = jest.fn((props: RowRenderProps<unknown>) => (
  <tr key={props.run.id}>
    <td>{props.run.runName}</td>
    <td>{props.run.annotationCount || props.run.tomogramCount || 0}</td>
  </tr>
))

const annotationConfig = {
  dataContentType: DataContentsType.Annotations,
  tableHeaders: mockTableHeaders,
  renderRow: mockRenderRow,
  skeletonColSpan: 2,
}

const tomogramConfig = {
  dataContentType: DataContentsType.Tomograms,
  tableHeaders: mockTableHeaders,
  renderRow: mockRenderRow,
  skeletonColSpan: 2,
}

async function renderLocationTable(
  props = baseProps,
  config = annotationConfig,
) {
  const { LocationTable } = await import('./LocationTable')

  render(<LocationTable {...props} config={config} />)
}

describe('<LocationTable />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockHookReturn.data = null
    mockHookReturn.isLoading = false
    mockHookReturn.error = null
  })

  describe('Hook Integration', () => {
    it('should call useDepositionRunsForDataset with correct parameters when expanded', async () => {
      await renderLocationTable({ ...baseProps, isExpanded: true })

      expect(mockUseDepositionRunsForDataset).toHaveBeenCalledWith({
        depositionId: 123,
        datasetId: 456,
        type: DataContentsType.Annotations,
        page: 1,
      })
    })

    it('should not fetch data when not expanded', async () => {
      await renderLocationTable({ ...baseProps, isExpanded: false })

      expect(mockUseDepositionRunsForDataset).toHaveBeenCalledWith({
        depositionId: undefined,
        datasetId: undefined,
        type: DataContentsType.Annotations,
        page: 1,
      })
    })

    it('should use currentGroupPage in hook call', async () => {
      await renderLocationTable({
        ...baseProps,
        isExpanded: true,
        currentGroupPage: 3,
      })

      expect(mockUseDepositionRunsForDataset).toHaveBeenCalledWith({
        depositionId: 123,
        datasetId: 456,
        type: DataContentsType.Annotations,
        page: 3,
      })
    })

    it('should default to page 1 when currentGroupPage is not provided', async () => {
      const propsWithoutPage = { ...baseProps, isExpanded: true }
      delete (propsWithoutPage as Record<string, unknown>).currentGroupPage
      await renderLocationTable(propsWithoutPage)

      expect(mockUseDepositionRunsForDataset).toHaveBeenCalledWith({
        depositionId: 123,
        datasetId: 456,
        type: DataContentsType.Annotations,
        page: 1,
      })
    })
  })

  describe('Loading State', () => {
    it('should render skeleton rows when loading and expanded', async () => {
      mockHookReturn.isLoading = true

      await renderLocationTable({ ...baseProps, isExpanded: true })

      // Should render skeleton rows equal to MAX_PER_ACCORDION_GROUP
      const skeletonRows = screen.getAllByRole('row')
      expect(skeletonRows).toHaveLength(MAX_PER_ACCORDION_GROUP + 1) // +1 for header row

      // Should render table headers
      expect(screen.getByText('Run Name')).toBeInTheDocument()
      expect(screen.getByText('Count')).toBeInTheDocument()
    })

    it('should not render skeleton when not expanded', async () => {
      mockHookReturn.isLoading = true

      await renderLocationTable({ ...baseProps, isExpanded: false })

      // Should render data with empty runs (not skeleton)
      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(1) // Only header row when no data
    })

    it('should not render skeleton when not loading', async () => {
      mockHookReturn.isLoading = false

      await renderLocationTable({ ...baseProps, isExpanded: true })

      // Should not find skeleton rows
      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(1) // Only header row when no data
    })
  })

  describe('Error State', () => {
    it('should render error message when expanded and has error', async () => {
      mockHookReturn.error = new Error('Network error')

      await renderLocationTable({ ...baseProps, isExpanded: true })

      expect(screen.getByText('errorLoadingRuns')).toBeInTheDocument()
      expect(screen.getByText('errorLoadingRuns')).toHaveClass(
        'p-4',
        'text-center',
        'text-red-600',
      )
    })

    it('should not render error message when not expanded', async () => {
      mockHookReturn.error = new Error('Network error')

      await renderLocationTable({ ...baseProps, isExpanded: false })

      expect(screen.queryByText('errorLoadingRuns')).not.toBeInTheDocument()
    })

    it('should not render error message when no error', async () => {
      mockHookReturn.error = null

      await renderLocationTable({ ...baseProps, isExpanded: true })

      expect(screen.queryByText('errorLoadingRuns')).not.toBeInTheDocument()
    })
  })

  describe('Data Rendering - Annotations', () => {
    beforeEach(() => {
      mockHookReturn.data = mockAnnotationRunsData
    })

    it('should render annotation data correctly', async () => {
      await renderLocationTable({ ...baseProps, isExpanded: true })

      // Should render table headers
      expect(screen.getByText('Run Name')).toBeInTheDocument()
      expect(screen.getByText('Count')).toBeInTheDocument()

      // Should call renderRow for each run
      expect(mockRenderRow).toHaveBeenCalledTimes(2)

      // Check first run call
      expect(mockRenderRow).toHaveBeenCalledWith(
        expect.objectContaining({
          run: expect.objectContaining({
            id: 1,
            runName: 'run1',
            annotationCount: 10, // From annotationShapesAggregate
            items: [],
          }),
          depositionId: 123,
          isExpanded: false, // From expandedRuns
          currentPage: 1, // From runPagination
          location: 'Test Dataset',
        }),
      )

      // Check second run call
      expect(mockRenderRow).toHaveBeenCalledWith(
        expect.objectContaining({
          run: expect.objectContaining({
            id: 2,
            runName: 'run2',
            annotationCount: 15, // From annotationShapesAggregate
            items: [],
          }),
          depositionId: 123,
          isExpanded: true, // From expandedRuns
          currentPage: 2, // From runPagination
          location: 'Test Dataset',
        }),
      )
    })

    it('should handle missing annotation count', async () => {
      const dataWithMissingCounts = {
        ...mockAnnotationRunsData,
        annotationShapesAggregate: {
          __typename: 'AnnotationShapeAggregate' as const,
          aggregate: [
            {
              __typename: 'AnnotationShapeAggregateFunctions' as const,
              count: 5,
              groupBy: {
                __typename: 'AnnotationShapeGroupByOptions' as const,
                annotation: {
                  __typename: 'AnnotationGroupByOptions' as const,
                  run: { __typename: 'RunGroupByOptions' as const, id: 1 },
                },
              },
            },
            // Missing entry for run 2
          ],
        },
      }
      mockHookReturn.data = dataWithMissingCounts

      await renderLocationTable({ ...baseProps, isExpanded: true })

      // Should default to 0 for missing counts
      expect(mockRenderRow).toHaveBeenCalledWith(
        expect.objectContaining({
          run: expect.objectContaining({
            id: 2,
            runName: 'run2',
            annotationCount: 0,
          }),
        }),
      )
    })
  })

  describe('Data Rendering - Tomograms', () => {
    beforeEach(() => {
      mockHookReturn.data = mockTomogramRunsData
    })

    it('should render tomogram data correctly', async () => {
      await renderLocationTable(
        { ...baseProps, isExpanded: true },
        tomogramConfig,
      )

      expect(mockUseDepositionRunsForDataset).toHaveBeenCalledWith({
        depositionId: 123,
        datasetId: 456,
        type: DataContentsType.Tomograms,
        page: 1,
      })

      // Should call renderRow for each run
      expect(mockRenderRow).toHaveBeenCalledTimes(2)

      // Check first run call
      expect(mockRenderRow).toHaveBeenCalledWith(
        expect.objectContaining({
          run: expect.objectContaining({
            id: 3,
            runName: 'tomo-run1',
            tomogramCount: 8,
            items: [],
          }),
        }),
      )

      // Check second run call
      expect(mockRenderRow).toHaveBeenCalledWith(
        expect.objectContaining({
          run: expect.objectContaining({
            id: 4,
            runName: 'tomo-run2',
            tomogramCount: 12,
            items: [],
          }),
        }),
      )
    })

    it('should handle missing tomogram count', async () => {
      const dataWithMissingCounts = {
        ...mockTomogramRunsData,
        runs: [
          {
            ...mockTomogramRunsData.runs[0],
            tomogramsAggregate: null,
          },
          mockTomogramRunsData.runs[1],
        ],
      }
      mockHookReturn.data = dataWithMissingCounts

      await renderLocationTable(
        { ...baseProps, isExpanded: true },
        tomogramConfig,
      )

      // Should default to 0 for missing counts
      expect(mockRenderRow).toHaveBeenCalledWith(
        expect.objectContaining({
          run: expect.objectContaining({
            id: 3,
            runName: 'tomo-run1',
            tomogramCount: 0,
          }),
        }),
      )
    })
  })

  describe('Callback Functions', () => {
    beforeEach(() => {
      mockHookReturn.data = mockAnnotationRunsData
    })

    it('should pass onToggle callback that calls onRunToggle with correct parameters', async () => {
      await renderLocationTable({ ...baseProps, isExpanded: true })

      // Get the onToggle callback from the first run
      const firstRunCall = mockRenderRow.mock.calls[0][0]
      firstRunCall.onToggle()

      expect(baseProps.onRunToggle).toHaveBeenCalledWith('Test Dataset', 'run1')
    })

    it('should pass onPageChange callback that calls onRunPageChange with correct parameters', async () => {
      await renderLocationTable({ ...baseProps, isExpanded: true })

      // Get the onPageChange callback from the second run
      const secondRunCall = mockRenderRow.mock.calls[1][0]
      secondRunCall.onPageChange(5)

      expect(baseProps.onRunPageChange).toHaveBeenCalledWith(
        'Test Dataset',
        'run2',
        5,
      )
    })
  })

  describe('Default Values', () => {
    it('should handle null run names', async () => {
      const dataWithNullNames = {
        ...mockAnnotationRunsData,
        runs: [
          {
            ...mockAnnotationRunsData.runs[0],
            name: null as unknown as string,
          },
          mockAnnotationRunsData.runs[1],
        ],
      } as GetDepositionAnnoRunsForDatasetQuery
      mockHookReturn.data = dataWithNullNames

      await renderLocationTable({ ...baseProps, isExpanded: true })

      expect(mockRenderRow).toHaveBeenCalledWith(
        expect.objectContaining({
          run: expect.objectContaining({
            runName: '--', // Default for null name
          }),
        }),
      )
    })

    it('should use datasetTitle as depositedLocation when no data', async () => {
      mockHookReturn.data = null

      await renderLocationTable({ ...baseProps, isExpanded: true })

      // Should render with no runs but correct location
      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(1) // Only header row
    })

    it('should handle missing pagination data', async () => {
      mockHookReturn.data = mockAnnotationRunsData

      await renderLocationTable({
        ...baseProps,
        runPagination: {} as typeof baseProps.runPagination,
        isExpanded: true,
      })

      expect(mockRenderRow).toHaveBeenCalledWith(
        expect.objectContaining({
          currentPage: 1, // Default page
        }),
      )
    })

    it('should handle missing expanded runs data', async () => {
      mockHookReturn.data = mockAnnotationRunsData

      await renderLocationTable({
        ...baseProps,
        expandedRuns: {} as typeof baseProps.expandedRuns,
        isExpanded: true,
      })

      expect(mockRenderRow).toHaveBeenCalledWith(
        expect.objectContaining({
          isExpanded: false, // Default expanded state
        }),
      )
    })
  })

  describe('Table Structure', () => {
    beforeEach(() => {
      mockHookReturn.data = mockAnnotationRunsData
    })

    it('should render proper table structure', async () => {
      await renderLocationTable({ ...baseProps, isExpanded: true })

      // Should have table element
      expect(screen.getByRole('table')).toBeInTheDocument()

      // Should have table headers
      expect(screen.getByText('Run Name')).toBeInTheDocument()
      expect(screen.getByText('Count')).toBeInTheDocument()
    })

    it('should render custom table headers', async () => {
      const customHeaders = (
        <tr>
          <th>Custom Header 1</th>
          <th>Custom Header 2</th>
        </tr>
      )

      const customConfig = {
        ...annotationConfig,
        tableHeaders: customHeaders,
      }

      await renderLocationTable(
        { ...baseProps, isExpanded: true },
        customConfig,
      )

      expect(screen.getByText('Custom Header 1')).toBeInTheDocument()
      expect(screen.getByText('Custom Header 2')).toBeInTheDocument()
    })
  })
})

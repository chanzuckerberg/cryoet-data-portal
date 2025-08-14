import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { MockI18n } from 'app/components/I18n.mock'
import { DataContentsType } from 'app/types/deposition-queries'

// Mock the useDepositionRunsForDataset hook
const mockHookReturn = {
  data: null,
  isLoading: false,
  error: null,
}

const mockUseDepositionRunsForDataset = jest.fn(() => mockHookReturn)

jest.unstable_mockModule('app/queries/useDepositionRunsForDataset', () => ({
  __esModule: true,
  useDepositionRunsForDataset: mockUseDepositionRunsForDataset,
}))

// Mock all dependencies to avoid import issues
jest.unstable_mockModule('app/components/Table', () => ({
  __esModule: true,
  CellHeader: ({ children, style }: any) => (
    <th style={style} data-testid="cell-header">
      {children}
    </th>
  ),
}))

jest.unstable_mockModule('app/components/I18n', () => ({
  I18n: MockI18n,
}))

// Mock LocationTable to capture the props passed to it
const mockLocationTable = jest.fn()
jest.unstable_mockModule(
  'app/components/Deposition/shared/LocationTable',
  () => ({
    __esModule: true,
    LocationTable: mockLocationTable,
  }),
)

// Mock the SDS components to avoid QueryClient issues
jest.unstable_mockModule('@czi-sds/components', () => ({
  Table: ({ children, className }: any) => (
    <table className={className}>{children}</table>
  ),
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  CellComponent: ({ children, colSpan, className }: any) => (
    <td colSpan={colSpan} className={className}>
      {children}
    </td>
  ),
  TableRow: ({ children, className }: any) => (
    <tr className={className}>{children}</tr>
  ),
}))

const mockRunRow = jest.fn()
jest.unstable_mockModule('app/components/Deposition/RunRow', () => ({
  __esModule: true,
  RunRow: mockRunRow,
}))

async function renderAnnotationLocationTable(props: any) {
  const { AnnotationLocationTable } = await import('./AnnotationLocationTable')
  render(<AnnotationLocationTable {...props} />)
}

describe('AnnotationLocationTable', () => {
  beforeAll(() => {
    // Clear any previous mocks
    jest.clearAllMocks()

    // Set up the mock to return a simple div to capture props
    mockLocationTable.mockImplementation((_props: any) => (
      <div data-testid="location-table">LocationTable Mock</div>
    ))

    mockRunRow.mockImplementation(() => <div data-testid="run-row" />)
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockHookReturn.data = null
    mockHookReturn.isLoading = false
    mockHookReturn.error = null
  })

  it('should render without crashing', async () => {
    const props = {
      runPagination: {},
      expandedRuns: {},
      onRunToggle: jest.fn(),
      onRunPageChange: jest.fn(),
      depositionId: 123,
      datasetId: 456,
      datasetTitle: 'Test Dataset',
      isExpanded: true,
      currentGroupPage: 1,
    }

    await renderAnnotationLocationTable(props)

    // Verify that our mock LocationTable was rendered
    expect(screen.getByTestId('location-table')).toBeInTheDocument()
  })

  it('should pass correct DataContentsType to LocationTable', async () => {
    const props = {
      runPagination: {},
      expandedRuns: {},
      onRunToggle: jest.fn(),
      onRunPageChange: jest.fn(),
      depositionId: 123,
      datasetId: 456,
      datasetTitle: 'Test Dataset',
      isExpanded: true,
      currentGroupPage: 1,
    }

    await renderAnnotationLocationTable(props)

    // Check that LocationTable was called with the correct props
    expect(mockLocationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          dataContentType: DataContentsType.Annotations,
        }),
      }),
      expect.anything(),
    )
  })

  it('should configure correct skeleton column span', async () => {
    const props = {
      runPagination: {},
      expandedRuns: {},
      onRunToggle: jest.fn(),
      onRunPageChange: jest.fn(),
      depositionId: 123,
      datasetId: 456,
      datasetTitle: 'Test Dataset',
      isExpanded: true,
      currentGroupPage: 1,
    }

    await renderAnnotationLocationTable(props)

    expect(mockLocationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          skeletonColSpan: 3,
        }),
      }),
      expect.anything(),
    )
  })

  it('should configure annotation-specific table headers', async () => {
    const props = {
      runPagination: {},
      expandedRuns: {},
      onRunToggle: jest.fn(),
      onRunPageChange: jest.fn(),
      depositionId: 123,
      datasetId: 456,
      datasetTitle: 'Test Dataset',
      isExpanded: true,
      currentGroupPage: 1,
    }

    await renderAnnotationLocationTable(props)

    expect(mockLocationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          tableHeaders: expect.any(Object),
        }),
      }),
      expect.anything(),
    )

    // Check that tableHeaders is a valid React element
    const lastCall =
      mockLocationTable.mock.calls[mockLocationTable.mock.calls.length - 1]
    const { config } = lastCall[0] as any
    expect(React.isValidElement(config.tableHeaders)).toBe(true)
  })

  it('should use RunRow as row renderer', async () => {
    const props = {
      runPagination: {},
      expandedRuns: {},
      onRunToggle: jest.fn(),
      onRunPageChange: jest.fn(),
      depositionId: 123,
      datasetId: 456,
      datasetTitle: 'Test Dataset',
      isExpanded: true,
      currentGroupPage: 1,
    }

    await renderAnnotationLocationTable(props)

    expect(mockLocationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          renderRow: expect.any(Function),
        }),
      }),
      expect.anything(),
    )

    // Test the renderRow function
    const lastCall =
      mockLocationTable.mock.calls[mockLocationTable.mock.calls.length - 1]
    const { config } = lastCall[0] as any

    const mockRowProps = {
      run: {
        runName: 'test-run',
        id: 1,
        items: [],
        annotationCount: 5,
      },
      depositionId: 123,
      isExpanded: false,
      onToggle: jest.fn(),
      currentPage: 1,
      onPageChange: jest.fn(),
      location: 'test-location',
    }

    const rowElement = config.renderRow(mockRowProps)
    expect(rowElement).toBeDefined()
    expect(React.isValidElement(rowElement)).toBe(true)
    expect(rowElement.key).toBe('test-run')
  })

  it('should forward all base props to LocationTable', async () => {
    const props = {
      runPagination: { loc1: { run1: 1 } },
      expandedRuns: { loc1: { run1: true } },
      onRunToggle: jest.fn(),
      onRunPageChange: jest.fn(),
      depositionId: 999,
      datasetId: 888,
      datasetTitle: 'Custom Dataset',
      isExpanded: false,
      currentGroupPage: 2,
    }

    await renderAnnotationLocationTable(props)

    // Check that base props are forwarded
    expect(mockLocationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        runPagination: props.runPagination,
        expandedRuns: props.expandedRuns,
        onRunToggle: props.onRunToggle,
        onRunPageChange: props.onRunPageChange,
        depositionId: 999,
        datasetId: 888,
        datasetTitle: 'Custom Dataset',
        isExpanded: false,
        currentGroupPage: 2,
      }),
      expect.anything(),
    )
  })
})

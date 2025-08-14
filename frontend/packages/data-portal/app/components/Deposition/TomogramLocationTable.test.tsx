import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { MockI18n } from 'app/components/I18n.mock'
import { DepositionTomogramTableWidths } from 'app/constants/table'
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
  CellHeader: ({ children, style, className }: any) => (
    <th style={style} className={className} data-testid="cell-header">
      {children}
    </th>
  ),
}))

jest.unstable_mockModule('app/components/I18n', () => ({
  I18n: MockI18n,
}))

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

const mockTomogramRow = jest.fn()
jest.unstable_mockModule('app/components/Deposition/TomogramRow', () => ({
  __esModule: true,
  TomogramRow: mockTomogramRow,
}))

async function renderTomogramLocationTable(props: any) {
  const { TomogramLocationTable } = await import('./TomogramLocationTable')
  render(<TomogramLocationTable {...props} />)
}

describe('TomogramLocationTable', () => {
  beforeAll(() => {
    // Clear any previous mocks
    jest.clearAllMocks()

    // Set up the mock to return a simple div to capture props
    mockLocationTable.mockImplementation((_props: any) => (
      <div data-testid="location-table">LocationTable Mock</div>
    ))

    mockTomogramRow.mockImplementation(() => <div data-testid="tomogram-row" />)
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

    await renderTomogramLocationTable(props)

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

    await renderTomogramLocationTable(props)

    // Check that LocationTable was called with the correct props
    expect(mockLocationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          dataContentType: DataContentsType.Tomograms,
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

    await renderTomogramLocationTable(props)

    expect(mockLocationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          skeletonColSpan: 7,
        }),
      }),
      expect.anything(),
    )
  })

  it('should configure tomogram-specific table headers with correct widths', async () => {
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

    await renderTomogramLocationTable(props)

    expect(mockLocationTable).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          tableHeaders: expect.any(Object),
        }),
      }),
      expect.anything(),
    )

    // Get the config from the mock call to verify table headers structure
    const lastCall =
      mockLocationTable.mock.calls[mockLocationTable.mock.calls.length - 1]
    const { config } = lastCall[0] as any

    expect(config.tableHeaders).toBeDefined()

    // The tableHeaders should be a React element containing our mocked CellHeaders
    expect(config.tableHeaders.type).toBe(React.Fragment)
    expect(config.tableHeaders.props.children).toHaveLength(6)

    // Verify that each header has the correct properties by checking the JSX children
    const headers = config.tableHeaders.props.children

    // Photo header (empty content)
    expect(headers[0].props.style).toEqual(DepositionTomogramTableWidths.photo)
    expect(headers[0].props.children).toBe(' ')

    // Name header
    expect(headers[1].props.style).toEqual(DepositionTomogramTableWidths.name)
    expect(headers[1].props.children).toBe('tomogramName')

    // Voxel spacing header
    expect(headers[2].props.style).toEqual(
      DepositionTomogramTableWidths.voxelSpacing,
    )
    expect(headers[2].props.children).toBe('voxelSpacing')

    // Reconstruction method header
    expect(headers[3].props.style).toEqual(
      DepositionTomogramTableWidths.reconstructionMethod,
    )
    expect(headers[3].props.children).toBe('reconstructionMethod')
    expect(headers[3].props.className).toBe(
      'overflow-hidden text-ellipsis whitespace-nowrap',
    )

    // Post processing header
    expect(headers[4].props.style).toEqual(
      DepositionTomogramTableWidths.postProcessing,
    )
    expect(headers[4].props.children).toBe('postProcessing')

    // Actions header (empty content)
    expect(headers[5].props.style).toEqual(
      DepositionTomogramTableWidths.actions,
    )
    expect(headers[5].props.children).toBeUndefined()
  })

  it('should use TomogramRow as row renderer', async () => {
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

    await renderTomogramLocationTable(props)

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
        tomogramCount: 3,
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
    expect(rowElement.key).toBe('test-run')
    expect(rowElement.props.run).toEqual(mockRowProps.run)
    expect(rowElement.props.depositionId).toBe(123)
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

    await renderTomogramLocationTable(props)

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

  it('should handle photo and actions columns correctly', async () => {
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

    await renderTomogramLocationTable(props)

    // Get the config from the mock call to verify table headers structure
    const lastCall =
      mockLocationTable.mock.calls[mockLocationTable.mock.calls.length - 1]
    const { config } = lastCall[0] as any
    const headers = config.tableHeaders.props.children

    // Photo header should have a single space as content
    expect(headers[0].props.children).toBe(' ')
    expect(headers[0].props.style).toEqual(DepositionTomogramTableWidths.photo)

    // Actions header should be empty/undefined
    expect(headers[5].props.children).toBeUndefined()
    expect(headers[5].props.style).toEqual(
      DepositionTomogramTableWidths.actions,
    )
  })
})

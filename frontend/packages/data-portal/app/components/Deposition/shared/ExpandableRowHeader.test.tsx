import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  ExpandableRowHeader,
  ExpandableRowHeaderProps,
} from './ExpandableRowHeader'

const defaultProps: ExpandableRowHeaderProps = {
  runName: 'Test Run',
  isExpanded: false,
  onToggle: jest.fn(),
  totalCount: 10,
  currentPage: 1,
  totalPages: 2,
  onPageChange: jest.fn(),
  startIndex: 0,
  endIndex: 5,
  colSpan: 3,
  itemLabel: 'annotation',
  itemsLabel: 'annotations',
}

describe('<ExpandableRowHeader />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('annotation configuration', () => {
    it('should render with colSpan=3 for annotations', () => {
      render(
        <table>
          <tbody>
            <ExpandableRowHeader
              {...defaultProps}
              colSpan={3}
              itemLabel="annotation"
              itemsLabel="annotations"
            />
          </tbody>
        </table>,
      )

      const cell = screen.getByRole('cell')
      expect(cell).toHaveAttribute('colspan', '3')
    })

    it('should display annotation count when collapsed', () => {
      render(
        <table>
          <tbody>
            <ExpandableRowHeader
              {...defaultProps}
              totalCount={5}
              itemLabel="annotation"
              itemsLabel="annotations"
              isExpanded={false}
            />
          </tbody>
        </table>,
      )

      expect(screen.getByText('5 annotations')).toBeInTheDocument()
    })
  })

  describe('tomogram configuration', () => {
    it('should render with colSpan=7 for tomograms', () => {
      render(
        <table>
          <tbody>
            <ExpandableRowHeader
              {...defaultProps}
              colSpan={7}
              itemLabel="tomogram"
              itemsLabel="tomograms"
            />
          </tbody>
        </table>,
      )

      const cell = screen.getByRole('cell')
      expect(cell).toHaveAttribute('colspan', '7')
    })

    it('should display tomogram count when collapsed', () => {
      render(
        <table>
          <tbody>
            <ExpandableRowHeader
              {...defaultProps}
              totalCount={3}
              itemLabel="tomogram"
              itemsLabel="tomograms"
              isExpanded={false}
            />
          </tbody>
        </table>,
      )

      expect(screen.getByText('3 tomograms')).toBeInTheDocument()
    })
  })

  describe('expandable behavior', () => {
    it('should be clickable when collapsed', () => {
      const mockOnToggle = jest.fn()
      render(
        <table>
          <tbody>
            <ExpandableRowHeader
              {...defaultProps}
              isExpanded={false}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>,
      )

      const row = screen.getByRole('row')
      expect(row).toHaveClass('cursor-pointer')
    })

    it('should be clickable when expanded', () => {
      const mockOnToggle = jest.fn()
      render(
        <table>
          <tbody>
            <ExpandableRowHeader
              {...defaultProps}
              isExpanded
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>,
      )

      const row = screen.getByRole('row')
      expect(row).toHaveClass('cursor-pointer')
    })
  })

  describe('expanded state', () => {
    it('should hide count display when expanded', () => {
      render(
        <table>
          <tbody>
            <ExpandableRowHeader {...defaultProps} isExpanded />
          </tbody>
        </table>,
      )

      // When expanded, should not show the count display
      expect(screen.queryByText(/\d+ annotations/)).not.toBeInTheDocument()
    })
  })

  describe('collapsed state', () => {
    it('should show count display when collapsed', () => {
      render(
        <table>
          <tbody>
            <ExpandableRowHeader {...defaultProps} isExpanded={false} />
          </tbody>
        </table>,
      )

      expect(screen.getByText('10 annotations')).toBeInTheDocument()
      expect(
        screen.queryByTestId('pagination-controls'),
      ).not.toBeInTheDocument()
    })
  })

  describe('onClick behavior', () => {
    it('should call onToggle when row is clicked', async () => {
      const mockOnToggle = jest.fn()
      render(
        <table>
          <tbody>
            <ExpandableRowHeader {...defaultProps} onToggle={mockOnToggle} />
          </tbody>
        </table>,
      )

      const row = screen.getByRole('row')
      await userEvent.click(row)

      expect(mockOnToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('pluralization logic', () => {
    it('should show singular form for count of 1', () => {
      render(
        <table>
          <tbody>
            <ExpandableRowHeader
              {...defaultProps}
              totalCount={1}
              itemLabel="annotation"
              itemsLabel="annotations"
              isExpanded={false}
            />
          </tbody>
        </table>,
      )

      expect(screen.getByText('1 annotation')).toBeInTheDocument()
    })

    it('should show plural form for count greater than 1', () => {
      render(
        <table>
          <tbody>
            <ExpandableRowHeader
              {...defaultProps}
              totalCount={5}
              itemLabel="annotation"
              itemsLabel="annotations"
              isExpanded={false}
            />
          </tbody>
        </table>,
      )

      expect(screen.getByText('5 annotations')).toBeInTheDocument()
    })

    it('should show plural form for count of 0', () => {
      render(
        <table>
          <tbody>
            <ExpandableRowHeader
              {...defaultProps}
              totalCount={0}
              itemLabel="annotation"
              itemsLabel="annotations"
              isExpanded={false}
            />
          </tbody>
        </table>,
      )

      expect(screen.getByText('0 annotations')).toBeInTheDocument()
    })
  })

  describe('run name display', () => {
    it('should display the run name with proper formatting', () => {
      render(
        <table>
          <tbody>
            <ExpandableRowHeader {...defaultProps} runName="My Test Run" />
          </tbody>
        </table>,
      )

      expect(screen.getByText('run: My Test Run')).toBeInTheDocument()
    })
  })
})

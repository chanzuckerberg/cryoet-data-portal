/* eslint-disable @typescript-eslint/no-explicit-any, unused-imports/no-unused-vars, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, jest/no-conditional-expect, testing-library/no-node-access */

import { beforeEach, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import type { Step } from 'react-joyride'

import { getMockUser } from 'app/utils/mock'

const mockCallback = jest.fn()
const mockOnRestart = jest.fn()
const mockOnClose = jest.fn()
const mockOnMove = jest.fn()

// Mock react-joyride - not exhaustive, just for testing purposes
// Real joyride library does not work well in the test environment
const mockJoyride = jest.fn()
jest.unstable_mockModule('react-joyride', () => ({
  default: mockJoyride, // Joyride component mock
  ACTIONS: {
    CLOSE: 'close',
    NEXT: 'next',
    PREV: 'prev',
    START: 'start',
    STOP: 'stop',
    UPDATE: 'update',
  },
  EVENTS: {
    STEP_AFTER: 'step:after',
    TARGET_NOT_FOUND: 'target:not_found',
  },
  ORIGIN: {
    KEYBOARD: 'keyboard',
  },
  STATUS: {
    FINISHED: 'finished',
    SKIPPED: 'skipped',
  },
}))

jest.unstable_mockModule('@czi-sds/components', () => ({
  Icon: ({ sdsIcon, sdsSize, ...props }: any) => (
    <span {...props} data-testid={`icon-${sdsIcon}`}>
      {sdsIcon}
    </span>
  ),
  Button: ({ children, sdsType, sdsStyle, sdsSize, ...props }: any) => (
    <button {...{ type: 'button', ...props }}>{children}</button>
  ),
}))

async function renderTour(props?: any) {
  const { Tour } = await import('./Tour')
  const defaultProps = {
    steps: mockSteps,
    run: true,
    stepIndex: 0,
    onRestart: mockOnRestart,
    onClose: mockOnClose,
    onMove: mockOnMove,
    proxySelectors: mockProxySelectors,
    proxyIndex: 0,
    ...props,
  }
  render(<Tour {...defaultProps} />)
}

// Mock data for tests
const mockSteps: Step[] = [
  { target: '.step-1', content: 'Welcome to the tour!', title: 'Title start' },
  { target: '.step-2', content: 'This is step 2', title: 'Step 2 title' },
  {
    target: '.step-3',
    content: 'Final step content',
    title: 'Final Step title',
  },
]

const mockProxySelectors = [
  { target: '.proxy-1', className: 'proxy-class-1' },
  { target: '.proxy-2', className: 'proxy-class-2' },
]

describe('<Tour />', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock DOM elements for ProxyOverlay
    const mockIframe = document.createElement('iframe')
    const mockContentDocument = document.implementation.createHTMLDocument()
    const mockTarget = document.createElement('div')

    Object.defineProperty(mockTarget, 'getBoundingClientRect', {
      value: jest.fn().mockReturnValue({
        top: 100,
        left: 200,
        width: 300,
        height: 150,
        right: 500,
        bottom: 250,
        x: 200,
        y: 100,
      }),
    })

    Object.defineProperty(mockIframe, 'getBoundingClientRect', {
      value: jest.fn().mockReturnValue({
        top: 50,
        left: 100,
        width: 800,
        height: 600,
        right: 900,
        bottom: 650,
        x: 100,
        y: 50,
      }),
    })

    Object.defineProperty(mockIframe, 'contentDocument', {
      value: mockContentDocument,
    })

    mockContentDocument.querySelector = jest.fn().mockReturnValue(mockTarget)
    document.querySelector = jest.fn().mockReturnValue(mockIframe)

    // Setup default Joyride mock
    mockJoyride.mockImplementation((props: any) => {
      const { tooltipComponent, callback } = props
      mockCallback.mockImplementation(callback)

      const mockTooltipProps = {
        index: 0,
        isLastStep: false,
        size: 3,
        step: mockSteps[0],
        closeProps: { onClick: jest.fn() },
        backProps: { onClick: jest.fn() },
        primaryProps: { onClick: jest.fn() },
      }

      return (
        <div data-testid="joyride-mock">
          {tooltipComponent && tooltipComponent(mockTooltipProps)}
        </div>
      )
    })
  })

  it('should render Joyride component with correct props', async () => {
    await renderTour()

    expect(mockJoyride).toHaveBeenCalledWith(
      expect.objectContaining({
        steps: mockSteps,
        run: true,
        stepIndex: 0,
        spotlightClicks: true,
        spotlightPadding: 0,
        continuous: true,
        disableOverlayClose: true,
        disableScrolling: true,
        floaterProps: { hideArrow: true },
        styles: {
          options: {
            zIndex: 10000,
          },
        },
        callback: expect.any(Function),
        tooltipComponent: expect.any(Function),
      }),
      {},
    )
    expect(screen.getByText('Welcome to the tour!')).toBeInTheDocument()
  })

  it('should render proxy overlays for each selector', async () => {
    await renderTour()

    // Check that proxy overlays are rendered with the expected classes
    const proxyElement1 = screen
      .getByTestId('joyride-mock')
      .parentElement?.querySelector('.proxy-class-1')
    const proxyElement2 = screen
      .getByTestId('joyride-mock')
      .parentElement?.querySelector('.proxy-class-2')

    expect(proxyElement1).toBeInTheDocument()
    expect(proxyElement2).toBeInTheDocument()
  })

  it('should handle run=false', async () => {
    await renderTour({ run: false })

    expect(screen.queryByText('Welcome to the tour!')).not.toBeInTheDocument()
  })

  describe('Custom Tooltip', () => {
    mockSteps.forEach((step, index) => {
      it(`should render custom tooltip for step ${index + 1}`, async () => {
        mockJoyride.mockImplementation((props: any) => {
          const { tooltipComponent } = props
          const mockTooltipProps = {
            index,
            isLastStep: index === mockSteps.length - 1,
            size: mockSteps.length,
            step,
            closeProps: { onClick: jest.fn() },
            backProps: { onClick: jest.fn() },
            primaryProps: { onClick: jest.fn() },
          }

          return (
            <div data-testid="joyride-mock">
              {tooltipComponent(mockTooltipProps)}
            </div>
          )
        })
        await renderTour()

        expect(screen.getByText(`${step.title as string}`)).toBeInTheDocument()
        expect(
          screen.getByText(`${step.content as string}`),
        ).toBeInTheDocument()
        expect(screen.getByRole('button', { name: '' })).toBeInTheDocument()
        if (index === 0) {
          expect(screen.getByText('close')).toBeInTheDocument()
          expect(screen.getByText('takeTour')).toBeInTheDocument()
        } else if (index !== mockSteps.length - 1) {
          expect(screen.getByText('previous')).toBeInTheDocument()
          expect(screen.getByText('next')).toBeInTheDocument()
        } else {
          expect(screen.getByText('restart')).toBeInTheDocument()
          expect(screen.getByText('closeTour')).toBeInTheDocument()
        }
      })
    })

    it('should call onClose when X button is clicked', async () => {
      mockJoyride.mockImplementation((props: any) => {
        const { tooltipComponent } = props
        const mockTooltipProps = {
          index: 0,
          isLastStep: false,
          size: 3,
          step: mockSteps[0],
          closeProps: { onClick: jest.fn() },
          backProps: { onClick: jest.fn() },
          primaryProps: { onClick: jest.fn() },
        }

        return (
          <div data-testid="joyride-mock">
            {tooltipComponent(mockTooltipProps)}
          </div>
        )
      })

      await renderTour()

      const closeButton = screen.getByRole('button', { name: '' })
      await getMockUser().click(closeButton)
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should call onRestart when restart button is clicked', async () => {
      mockJoyride.mockImplementation((props: any) => {
        const { tooltipComponent } = props
        const mockTooltipProps = {
          index: 2,
          isLastStep: true,
          size: 3,
          step: mockSteps[2],
          closeProps: { onClick: jest.fn() },
          backProps: { onClick: jest.fn() },
          primaryProps: { onClick: jest.fn() },
        }

        return (
          <div data-testid="joyride-mock">
            {tooltipComponent(mockTooltipProps)}
          </div>
        )
      })

      await renderTour()

      const restartButton = screen.getByText('restart')
      expect(restartButton).toBeInTheDocument()
      await getMockUser().click(restartButton)
      expect(mockOnRestart).toHaveBeenCalled()
    })
  })

  describe('Joyride callbacks', () => {
    it('should call onClose when CLOSE action with keyboard origin', async () => {
      await renderTour()

      const callbackData = {
        action: 'close',
        origin: 'keyboard',
        index: 0,
        status: 'running',
        type: 'step:before',
      }

      mockCallback(callbackData)
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should call onMove for STEP_AFTER event', async () => {
      await renderTour()

      const callbackData = {
        action: 'next',
        index: 1,
        status: 'running',
        type: 'step:after',
      }

      mockCallback(callbackData)
      expect(mockOnMove).toHaveBeenCalledWith(1, 'next')
    })

    it('should call onMove backwards for prev action', async () => {
      await renderTour()
      const callbackData = {
        action: 'prev',
        index: 0,
        status: 'running',
        type: 'step:after',
      }
      mockCallback(callbackData)
      expect(mockOnMove).toHaveBeenCalledWith(0, 'prev')
    })

    it('should call onClose when tour is finished', async () => {
      await renderTour()

      const callbackData = {
        action: 'next',
        index: 2,
        status: 'finished',
        type: 'tour:end',
      }

      mockCallback(callbackData)
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('ProxyOverlay', () => {
    it('should handle special characters in selectors', async () => {
      const specialSelectors = [
        { target: '.test[data-id="123"]', className: 'test-class' },
        { target: '#complex:selector', className: 'complex-class' },
      ]

      await renderTour({ proxySelectors: specialSelectors })

      // Check that elements with sanitized IDs and classes are created
      const sanitizedElement1 = screen
        .getByTestId('joyride-mock')
        .parentElement?.querySelector('.test-class')
      const sanitizedElement2 = screen
        .getByTestId('joyride-mock')
        .parentElement?.querySelector('.complex-class')

      expect(sanitizedElement1).toBeInTheDocument()
      expect(sanitizedElement2).toBeInTheDocument()
    })

    it('should handle window resize events', async () => {
      await renderTour()

      // Simulate window resize
      fireEvent(window, new Event('resize'))

      // Verify getBoundingClientRect was called after resize
      expect(
        document.querySelector('iframe')?.getBoundingClientRect,
      ).toHaveBeenCalled()
    })
  })
})

import { Button } from '@czi-sds/components'
import { SnackbarCloseReason } from '@mui/material/Snackbar'
import {
  currentNeuroglancerState,
  NeuroglancerAwareIframe,
  NeuroglancerWrapper,
  updateState,
} from 'neuroglancer'
import { useEffect, useRef, useState } from 'react'

import { GetRunByIdV2Query } from 'app/__generated_v2__/graphql'
import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { InfoIcon } from 'app/components/icons'
import { MenuItemLink } from 'app/components/MenuItemLink'
import { IdPrefix } from 'app/constants/idPrefixes'
import { QueryParams } from 'app/constants/query'
import { useAutoHideSnackbar } from 'app/hooks/useAutoHideSnackbar'
import { useEffectOnce } from 'app/hooks/useEffectOnce'
import { useI18n } from 'app/hooks/useI18n'
import { useTour } from 'app/hooks/useTour'
import { cns } from 'app/utils/cns'

import { ReusableSnackbar } from '../common/ReusableSnackbar/ReusableSnackbar'
import {
  ABOUT_LINKS,
  NEUROGLANCER_DOC_LINK,
  REPORT_LINKS,
} from '../Layout/constants'
import { CryoETHomeLink } from '../Layout/CryoETHomeLink'
import { MenuDropdownRef, MenuDropdownSection } from '../MenuDropdown'
import { Tooltip } from '../Tooltip'
import { NeuroglancerBanner } from './NeuroglancerBanner'
import {
  NeuroglancerDropdown,
  NeuroglancerDropdownOption,
} from './NeuroglancerDropdown'
import {
  axisLineEnabled,
  chainStateModifiers,
  getCurrentState,
  hasBoundingBox,
  isAllLayerActive,
  isCurrentLayout,
  isDepositionActivated,
  isDimensionPanelVisible,
  isTopBarVisible,
  panelsDefaultValues,
  resolveStateBool,
  setCurrentLayout,
  setTopBarVisibleFromSuperState,
  setupTourPanelState,
  showScaleBarEnabled,
  showSectionsEnabled,
  snap,
  toggleAllDepositions,
  toggleAxisLine,
  toggleBoundingBox,
  toggleDepositions,
  toggleOrMakeDimensionPanel,
  togglePanels,
  toggleShowScaleBar,
  toggleShowSections,
  toggleTopBar,
  ViewerPageSuperState,
} from './state'
import { getTutorialSteps, proxyStepSelectors } from './steps'
import { Tour } from './Tour'
import styles from './ViewerPage.module.css'

type Run = GetRunByIdV2Query['runs'][number]
type Annotations = Run['annotations']
type Annotation = Annotations['edges'][number]['node']
interface AnnotationUIConfig {
  name?: string
  annotation: Annotation
}

const buildDepositionsConfig = (
  annotations: Annotations,
): Record<number, AnnotationUIConfig[]> => {
  const config: Record<number, AnnotationUIConfig[]> = {}
  const layers = currentNeuroglancerState().layers || []
  for (const annotation of annotations.edges.map((e) => e.node)) {
    let { depositionId } = annotation
    const httpsPath = annotation.httpsMetadataPath
      .replace('.json', '')
      .split('/')
      .slice(-2)
      .join('-')
    const layer = layers.find((l) => {
      if (!l.source) return false
      if (typeof l.source === 'string') {
        return l.source.includes(httpsPath)
      }
      if (typeof l.source === 'object' && l.source.url) {
        return l.source.url.includes(httpsPath)
      }
      return false
    })
    if (depositionId === undefined || depositionId === null) {
      depositionId = -1 // Use -1 for layers without a depositionId
    }
    if (!(depositionId in config)) {
      config[depositionId] = [{ name: layer?.name, annotation }]
    } else {
      config[depositionId].push({ name: layer?.name, annotation })
    }
  }
  return config
}

const isSmallScreen = () => {
  return (
    (window.innerHeight <= 950 && window.innerWidth <= 600) ||
    (window.innerHeight <= 600 && window.innerWidth <= 950)
  )
}

export function ViewerPage({
  run,
  shouldStartTour = false,
}: {
  run: Run
  shouldStartTour?: boolean
}) {
  const { t } = useI18n()
  const {
    tourRunning,
    setTourRunning,
    stepIndex,
    setStepIndex,
    handleTourStart,
    handleTourClose,
    handleRestart,
    handleTourStepMove,
    proxyIndex,
    setProxyIndex,
  } = useTour()
  const [renderVersion, setRenderVersion] = useState(0)
  const [bannerOpen, setBannerOpen] = useState<boolean>(false)
  const iframeRef = useRef<NeuroglancerAwareIframe>(null)
  const hashReady = useRef<boolean>(false)
  const helpMenuRef = useRef<MenuDropdownRef>(null)

  const shareSnackbar = useAutoHideSnackbar()
  const snapSnackbar = useAutoHideSnackbar()

  const depositionConfigs = buildDepositionsConfig(run.annotations)
  const shouldShowAnnotationDropdown = Object.keys(depositionConfigs).length > 0

  const scheduleRefresh = () => {
    setRenderVersion(renderVersion + 1)
  }

  useEffectOnce(() => {
    // Allows to handle neuroglancer key events while dropdown is open
    const keyDownHandler = (event: KeyboardEvent) => {
      const iframe = iframeRef.current
      if (!iframe) {
        return
      }
      const iframeWindow = iframe.contentWindow
      if (!iframeWindow) {
        return
      }

      const neuroglancerDiv = iframeWindow.neuroglancer
      if (!neuroglancerDiv) {
        return
      }
      const targetElement = neuroglancerDiv.element as HTMLElement | null
      if (!targetElement) {
        return
      }

      const simulatedEvent = new KeyboardEvent('keydown', {
        key: event.key,
        code: event.code,
        keyCode: event.keyCode,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
        bubbles: true,
      })

      targetElement.dispatchEvent(simulatedEvent)
    }

    // Schedule to check for small devices 1s after this save
    if (isSmallScreen()) {
      updateState((state) => {
        const newState = chainStateModifiers([
          togglePanels(false, /* commit = */ false),
          toggleTopBar(false, /* commit = */ false),
          setCurrentLayout('xy', /* commit = */ false),
        ])(state)
        return newState
      })
    } else {
      scheduleRefresh()
    }
    hashReady.current = true

    window.addEventListener('keydown', keyDownHandler)
    setTourRunning(shouldStartTour)
    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }
  })

  useEffect(() => {
    if (tourRunning && hashReady.current) {
      setupTourPanelState()
    }
  }, [tourRunning])

  const handleOnStateChange = (state: ViewerPageSuperState) => {
    scheduleRefresh()
    setTopBarVisibleFromSuperState()
    if (tourRunning && state.tourStepIndex !== undefined) {
      if (stepIndex !== state.tourStepIndex) {
        if (Math.abs(stepIndex - state.tourStepIndex) > 1) {
          handleRestart()
        }
        setProxyIndex(state.tourStepIndex)
        setStepIndex(state.tourStepIndex)
      }
    }
    if (!state.savedPanelsStatus) {
      return
    }
    updateState((newStateInput) => {
      const newState = newStateInput as ViewerPageSuperState
      const savedPanels = newState.savedPanelsStatus || []
      for (const panelName of savedPanels) {
        const visible = resolveStateBool(
          newState.neuroglancer[panelName]?.visible,
          panelsDefaultValues[panelName],
        )
        if (visible && savedPanels.includes(panelName)) {
          delete newState.savedPanelsStatus
          return newState
        }
      }
      return undefined
    })
  }

  const clearTourQueryParam = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete(QueryParams.ShowTour)
    window.history.replaceState({}, '', url.toString())
  }

  const handleTourCloseWithCleanup = () => {
    handleTourClose()
    clearTourQueryParam()
  }

  const handleTourStartWithMenuClose = () => {
    setBannerOpen(false)
    helpMenuRef.current?.closeMenu()
    handleTourStart()
  }

  const handleShareClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        shareSnackbar.show()
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to copy URL to clipboard:', err)
      })
  }

  const handleShareSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return
    }
    shareSnackbar.hide()
  }

  const handleSnapActionClick = () => {
    snap()
    snapSnackbar.show()
  }

  const handleSnapSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return
    }
    snapSnackbar.hide()
  }

  const helperText =
    'text-light-sds-color-primitive-gray-600 text-sds-body-xxxs-400-narrow'
  const activeRunBreadcrumb = (
    <Tooltip
      tooltip={`Go to Run ${run.name || t('runName')}`}
      className="flex items-center truncate max-w-0 lg:max-w-[12rem] 2xl:max-w-[20rem]"
    >
      <a href={`${window.origin}/runs/${run.id}`} className="truncate">
        {run.name}{' '}
      </a>
      <a
        href={`${window.origin}/runs/${run.id}`}
        className="text-dark-sds-color-primitive-gray-900 opacity-60 pl-1"
      >
        ({IdPrefix.Run}-{run.id})
      </a>
    </Tooltip>
  )

  const breadcrumbsData = {
    id: run.dataset?.id || 0,
    title: run.dataset?.title || 'dataset',
  }

  return (
    <div className="flex flex-col overflow-hidden h-full relative bg-dark-sds-color-primitive-gray-50">
      <nav
        className={cns(
          'bg-dark-sds-color-primitive-gray-50 text-dark-sds-color-primitive-gray-900',
          'flex flex-shrink-0 py-1 flex-col',
          'sticky top-0 z-30 max-h-20 items-start',
          'sm:flex-row sm:max-h-12 sm:items-center',
        )}
      >
        <div className="flex items-center gap-1 md:gap-4">
          <CryoETHomeLink textSize="text-sds-body-s-400-narrow" />
          <Breadcrumbs
            variant="neuroglancer"
            data={breadcrumbsData}
            activeBreadcrumbText={activeRunBreadcrumb}
          />
        </div>
        {/* Add empty space to push content to right */}
        <div className="basis-sds-xxl flex-grow md:mr-sds-xxl" />
        <div className="flex basis-auto flex-shrink-0">
          <div className="flex items-center pt-1 gap-[1px] sm:gap-1 sm:pt-0">
            {shouldShowAnnotationDropdown && (
              <NeuroglancerDropdown title="Annotations" variant="outlined">
                <MenuDropdownSection title="Show annotations for deposition">
                  <NeuroglancerDropdownOption
                    selected={isAllLayerActive()}
                    onSelect={() => toggleAllDepositions()}
                  >
                    {t('allDepositions')}
                  </NeuroglancerDropdownOption>
                  {Object.entries(depositionConfigs).map(
                    ([depositionId, depositions]) => {
                      const layersOfInterest = depositions.map((c) => c.name)
                      return (
                        <NeuroglancerDropdownOption
                          key={depositionId.toString()}
                          selected={isDepositionActivated(layersOfInterest)}
                          onSelect={() => {
                            toggleDepositions(layersOfInterest)
                          }}
                        >
                          <span className="line-clamp-3">
                            {depositions?.[0].annotation?.deposition?.title ||
                              'Deposition'}
                          </span>
                          <span className="text-sds-body-xxxs-400-narrow text-light-sds-color-primitive-gray-600">
                            {IdPrefix.Deposition}-{depositionId}
                          </span>
                        </NeuroglancerDropdownOption>
                      )
                    },
                  )}
                </MenuDropdownSection>
              </NeuroglancerDropdown>
            )}
            <NeuroglancerDropdown title="Layout" variant="outlined">
              <MenuDropdownSection title="Layout">
                <NeuroglancerDropdownOption
                  selected={
                    isCurrentLayout('4panel') || isCurrentLayout('4panel-alt')
                  }
                  onSelect={() => setCurrentLayout('4panel')}
                >
                  {t('4panels')}
                </NeuroglancerDropdownOption>
                <NeuroglancerDropdownOption
                  selected={isCurrentLayout('xy')}
                  onSelect={() => setCurrentLayout('xy')}
                >
                  XY
                </NeuroglancerDropdownOption>
                <NeuroglancerDropdownOption
                  selected={isCurrentLayout('xz')}
                  onSelect={() => setCurrentLayout('xz')}
                >
                  XZ
                </NeuroglancerDropdownOption>
                <NeuroglancerDropdownOption
                  selected={isCurrentLayout('yz')}
                  onSelect={() => setCurrentLayout('yz')}
                >
                  YZ
                </NeuroglancerDropdownOption>
                <NeuroglancerDropdownOption
                  selected={isCurrentLayout('3d')}
                  onSelect={() => setCurrentLayout('3d')}
                >
                  3D
                </NeuroglancerDropdownOption>
              </MenuDropdownSection>
              <MenuDropdownSection title="Toggle Panels">
                <NeuroglancerDropdownOption
                  selected={getCurrentState().savedPanelsStatus !== undefined}
                  onSelect={() => togglePanels()}
                >
                  {t('hideUI')}
                </NeuroglancerDropdownOption>
                <NeuroglancerDropdownOption
                  selected={isTopBarVisible()}
                  onSelect={() => toggleTopBar()}
                >
                  {t('showTopLayerBar')}
                </NeuroglancerDropdownOption>
                <NeuroglancerDropdownOption
                  selected={isDimensionPanelVisible()}
                  onSelect={toggleOrMakeDimensionPanel}
                >
                  {t('showPositionSelector')}
                </NeuroglancerDropdownOption>
              </MenuDropdownSection>
            </NeuroglancerDropdown>
            <NeuroglancerDropdown title="Actions" variant="outlined">
              <MenuDropdownSection title="Appearance">
                <NeuroglancerDropdownOption
                  selected={hasBoundingBox()}
                  onSelect={toggleBoundingBox}
                >
                  <div className="flex justify-between items-center">
                    <p>{t('bbox')}</p>
                    <p className={helperText}>v</p>
                  </div>
                </NeuroglancerDropdownOption>
                <NeuroglancerDropdownOption
                  selected={axisLineEnabled()}
                  onSelect={toggleAxisLine}
                >
                  <div className="flex justify-between items-center">
                    <p>{t('axisLines')}</p>
                    <p className={helperText}>a</p>
                  </div>
                </NeuroglancerDropdownOption>
                <NeuroglancerDropdownOption
                  selected={showScaleBarEnabled()}
                  onSelect={toggleShowScaleBar}
                >
                  <div className="flex justify-between items-center">
                    <p>{t('scaleBar')}</p>
                    <p className={helperText}>b</p>
                  </div>
                </NeuroglancerDropdownOption>
                <NeuroglancerDropdownOption
                  selected={showSectionsEnabled()}
                  onSelect={toggleShowSections}
                >
                  <div className="flex justify-between items-center">
                    <p>{t('crossSection')}</p>
                    <p className={helperText}>s</p>
                  </div>
                </NeuroglancerDropdownOption>
              </MenuDropdownSection>
              <MenuDropdownSection title="Move">
                <NeuroglancerDropdownOption
                  selected={false}
                  onSelect={handleSnapActionClick}
                >
                  <div className="flex justify-between items-center">
                    <p>{t('snapAction')}</p>
                    <p className={helperText}>z</p>
                  </div>
                </NeuroglancerDropdownOption>
              </MenuDropdownSection>
            </NeuroglancerDropdown>
            <Button
              sdsType="primary"
              sdsStyle="rounded"
              disabled={shareSnackbar.visible}
              onClick={handleShareClick}
            >
              {t('share')}
            </Button>
            <NeuroglancerDropdown
              ref={helpMenuRef}
              className="w-4 h-11 pl-1 py-3 sm:w-11 sm:px-3"
              buttonElement={<InfoIcon className="w-5 h-5" />}
            >
              <MenuDropdownSection title="About">
                {ABOUT_LINKS.map((option) => (
                  <MenuItemLink key={option.label} to={option.link} newTab>
                    {t(option.label)}
                  </MenuItemLink>
                ))}
              </MenuDropdownSection>
              <MenuDropdownSection title="Report">
                {REPORT_LINKS.map((option) => (
                  <MenuItemLink key={option.label} to={option.link}>
                    {t(option.label)}
                  </MenuItemLink>
                ))}
              </MenuDropdownSection>
              <MenuDropdownSection title="Neuroglancer help">
                <MenuItemLink to={NEUROGLANCER_DOC_LINK}>
                  {t('goToNeuroglancerDocumentation')}
                </MenuItemLink>
                <button
                  type="button"
                  className="py-1.5 px-2 w-full text-left hover:bg-light-sds-color-primitive-gray-300 hover:bg-opacity-30"
                  onClick={handleTourStartWithMenuClose}
                >
                  {t('neuroglancerWalkthrough')}
                </button>
              </MenuDropdownSection>
            </NeuroglancerDropdown>
          </div>
        </div>
      </nav>
      <div className={styles.iframeContainer}>
        {hashReady.current && (
          <NeuroglancerWrapper
            onStateChange={handleOnStateChange}
            ref={iframeRef}
            className={styles.neuroglancerIframe}
          />
        )}
      </div>
      {run && tourRunning && (
        <Tour
          run={tourRunning}
          stepIndex={stepIndex}
          steps={getTutorialSteps(t)}
          onRestart={handleRestart}
          onClose={handleTourCloseWithCleanup}
          onMove={handleTourStepMove}
          proxySelectors={proxyStepSelectors}
          proxyIndex={proxyIndex}
        />
      )}
      <ReusableSnackbar
        open={snapSnackbar.visible}
        handleClose={handleSnapSnackbarClose}
        variant="filled"
        severity="success"
        message={t('snapActionSuccess')}
      />
      <ReusableSnackbar
        open={shareSnackbar.visible}
        handleClose={handleShareSnackbarClose}
        variant="filled"
        severity="success"
        message={t('shareActionSuccess')}
      />
      <NeuroglancerBanner
        onStartTour={handleTourStartWithMenuClose}
        open={bannerOpen}
        setOpen={setBannerOpen}
        tourInProgress={tourRunning}
      />
    </div>
  )
}

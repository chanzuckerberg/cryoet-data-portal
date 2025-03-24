import { Step } from 'react-joyride'
import clsx from "clsx";

interface StepContentProps {
  children: any
  variant: 'default' | 'simple' | 'minimal' | 'compact'
  className?: string
}

const essentialControls = [
  {key: 'CTRL', action: 'scroll or Pinch', description: 'Zoom in/out of the 2D images'},
  {key: 'Left-click', action: 'drag', description: 'Pan in 2D'},
  {action: 'Scroll', description: 'Slice through 3D data'},
  {key: 'Left-Click', action: 'drag', description: 'Rotate 3D Volume'},
  {key: 'shift', action: 'click and rotate', description: 'Oblique slicing'}
]

const keyboardShortcuts = [
  {key: 'v', description: 'Toggle bounding box'},
  {key: 'a', description: 'Toggle axis lines'},
  {key: 'b', description: 'Toggle scale bar'}
]

const getIframeElement = (selector: string): HTMLElement | string => {
  const iframe = document.querySelector('iframe');
  if (iframe?.contentDocument) {
    const element = iframe.contentDocument.querySelector(selector) as HTMLElement;
    if (element) {
      const rect = element.getBoundingClientRect();
      const iframeRect = iframe.getBoundingClientRect();

      const proxyElement = document.createElement('div');
      proxyElement.style.position = 'absolute';
      proxyElement.style.top = `${rect.top + iframeRect.top}px`;
      proxyElement.style.left = `${rect.left + iframeRect.left}px`;
      proxyElement.style.width = `${rect.width}px`;
      proxyElement.style.height = `${rect.height}px`;
      proxyElement.style.zIndex = '-1';

      document.body.appendChild(proxyElement);
      return proxyElement;
    }
  }
  return 'body';
};

export const getTutorialSteps: () => Step[] = () => [
  {
    target: '.neuroglancer-iframe',
    placement: 'center',
    disableBeacon: true,
    title: 'Exploring CryoET Data in Neuroglancer',
    content: (
      <StepContent variant='default'>
        <div className="p-6 bg-[#EBEBEB] rounded"></div>
        <p className='flex flex-col gap-10'>
          <span>
            The CryoET Data Portal provides an interactive data viewer powered
            by Neuroglancer for visualizing and analyzing volumetric
            cryo-electron tomography (CryoET) data and annotations.
          </span>
          <span>
            Let's run through some key aspects of the data viewer and essential
            controls.
          </span>
        </p>
      </StepContent>
    ),
  },
  {
    target: getIframeElement('.neuroglancer-layer-group-viewer .neuroglancer-panel'),
    title: 'Main viewport',
    placement: 'left-start',
    content: (
      <StepContent variant='compact'>
        <div className="text-[#767676]">
          <p>The default visualization is a synchronized four panel layout:</p>
          <ul className="list-disc ps-5">
            <li>Three cross-sectional views showing orthogonal XY, XZ, and YZ slices</li>
            <li>One 3D view for model visualization and volume rendering</li>
          </ul>
        </div>
        <p className='text-black'>This is configurable from the 'Layout' dropdown in the top bar.</p>
      </StepContent>
    ),
  },
  {
    target: getIframeElement('.neuroglancer-rendered-data-panel'),
    title: 'Essential controls',
    placement: 'left-end',
    content: (
      <StepContent variant='simple'>
        <div className='mt-4 mb-4'></div>
        <p className='text-[#767676]'>Move, pan and zoom in each panels with these mouse navigation:</p>
        <div className='flex flex-col gap-3 mt-3'>
          <KeyActionList actions={essentialControls} />
        </div>
      </StepContent>
    ),
  },
  {
    target: getIframeElement('.neuroglancer-rendered-data-panel'),
    title: 'Keyboard shortcuts',
    placement: 'left-end',
    content: (
      <StepContent variant='simple'>
        <div className='mt-4 mb-4'></div>
        <p className='text-[#767676]'>Quickly access top tools with shortcuts. Here are some useful shortcuts:</p>
        <div className='flex flex-col gap-3 mt-3 mb-4'>
          <KeyActionList actions={keyboardShortcuts} />
        </div>
        <p>These actions are also easily accessible on the top bar.</p>
      </StepContent>
    ),
  },
  {
    target: getIframeElement('.neuroglancer-side-panel'),
    title: 'Layer management',
    placement: 'right-start',
    content: (
      <StepContent variant='simple'>
        <div className='mt-4 mb-4'></div>
        <p className='text-[#767676] flex flex-col gap-4'>
          <span>Data is organized into distinct layers, which all appear in this menu.</span>
          <span>You can toggle layer visibility, open layer controls or archive (hide from viewer and top layer bar) your layers from here.</span>
        </p>
      </StepContent>
    )
  },
  {
    target: getIframeElement('.neuroglancer-layer-side-panel-tab-view'),
    title: 'Layer controls',
    placement: 'left-start',
    content: (
      <StepContent variant='minimal'>
        <p className='text-[#767676]'>
          Change the visualization settings of individual layers here. 
          Change <span className='text-black'>layer colours</span> or <span className='text-black'>opacity</span>, 
          {' '}<span className='text-black'>image contrast limits</span>, 
          {' '}<span className='text-black'>rendering resolution</span> and more.
        </p>
      </StepContent>
    )
  },
  {
    target: getIframeElement('.neuroglancer-viewer-top-row'),
    title: 'Controls top panel',
    placement: 'bottom-end',
    content: (
      <StepContent variant='minimal'>
        <p className='text-[#767676] flex flex-col gap-4'>
          <span>Find some of the most crucial functionality in the main header bar, including loading groups of annotations, changing the viewer layout, and more!</span>
          <span>Just below this is the neuroglancer top bar, which contains even more detailed settings, such as the cross-section background color, should you need them.</span>
        </p>
      </StepContent>
    )
  },
  {
    target: '.neuroglancer-iframe',
    placement: 'center',
    title: 'Congratulations!',
    content: (
      <StepContent variant='default'>
        <p>You've just learned the basics of navigating and analysing annotated tomograms from the CryroET Data Portal with Neuroglancer!</p>
        <div className='flex flex-col gap-3'>
          <p>As a recap, here are some useful shortcuts</p>
          <div className='rounded p-4 bg-[#F8F8F8] flex flex-col gap-3'>
            <KeyActionList actions={essentialControls} />
          </div>
        </div>
        <p>Ready to learn more? Visit our <span className='font-semibold text-[#0B68F8]'><a href="#">documentation</a></span>.</p>
      </StepContent>
    )
  }
]

const StepContent = ({children, variant = "default", className} : StepContentProps) => {
  const variantStyles = {
    default: "flex flex-col gap-6 mt-6",
    compact: "flex flex-col gap-6 mt-1",
    simple: "flex flex-col",
    minimal: "mt-1",
  };

  return (
    <div className={clsx(variantStyles[variant], className)}>
      {children}
    </div>
  );
};

const KeyActionList = ({ actions }: { actions: { key?: string; action?: string; description: string }[] }) => (
  <>
    {actions.map((control, index) => (
      <div key={`${control.key}_${index}`} className="flex items-center justify-between">
        <p className='font-semibold text-xs font-mono whitespace-nowrap'>
          {control.key && (<>
            <span className='bg-[#EBEBEB] py-0.5 px-1 rounded-sm'>{control.key}</span>
          </>)}
          {control.action && control.key && <span>+ {' '}</span>}
          {control.action}
        </p>
        <p className='text-[#767676] text-xs text-right'>{control.description}</p>
      </div>
    ))}
  </>
);

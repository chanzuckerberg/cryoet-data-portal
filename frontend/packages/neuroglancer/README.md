# Cryoet neuroglancer as a library

This project provides an integration of Neuroglancer as a library for the CryoET Data Portal. The project relies on vite for the packaging as Neuroglancer still doesn't supports esbuild-based builds (used by remix).
The project relies on the integration of Neuroglancer in an iFrame and a set of hooks/functions to deal with updates of the state, as well as synchronizing Neuroglancer's state with the main page integrating the Neuroglancer component provided by the project. As the main window/page URL hash is sync with the one of the iFrame from Neuroglancer, it means that this project imposes the use of only 1 Neuroglancer component by page, multiple Neuroglancer component cannot be instanciated in a same page, otherwise the sync mechanism might get lost.

Here is a list of the features that are provided by this project:

- Neuroglancer as a React component
- Automatic state hash compression in the URL
- Automatic switch from uncompressed to compressed hash URL
- Super state including Neuroglancer state, so it's possible to store meta-information in the super state
- Set of functions to handle the state and the super state in a simple way, and way of getting notified when the internal state of Neuroglancer changes.

## How to include the Neuroglancer component in your page

Two things needs to be done to be able to have the Neuroglancer component running:

- serve the Neuroglancer wrapper iFrame/page (i.e: have an explicit endpoint for it)
- use the Neuroglancer Wrapper provided by this project in your component,

Here is the way, using `express` to register the new route and how to serve the Neuroglancer Wrapper:

```typescript
async function main() {
  const app = express()
  // ...
  app.use(
    '/neuroglancer', // The base path of the Neuroglancer wrapper can be changed here
    express.static(path.join('..', 'neuroglancer', 'dist')),
  )
  // ...
}
```

In this snippet, the wrapper will be served from `/neuroglancer`. This is the default value, but can be changed to any value.

Then, it's just a matter of using the component:

```typescript
const MyComponent = ({}) => {
    return (
        // ...
        <NeuroglancerWrapper />
    )
}
```

If the base path configured for the server is not `/neuroglancer`, the `baseUrl` prop needs to be passed to the component:

```typescript
const MyComponent = ({}) => {
    return (
        // ...
        <NeuroglancerWrapper baseUrl="/mypath" />
    )
}
```

Here is a list of the props that can be used on this component:

- `baseUrl?` => changes the base path were the wrapper is hosted (by default `/neuroglancer`)
- `onStateChange?` => a callback that is called every time Neuroglancer internal state changes (not considering any state change performed from outside of Neuroglancer by a button, or something)
- `compressURL?` => activates or not the URL compression (by default `true`)

## How to access the state and super state

Accessing the state in the context of this wrapper actually means accessing a super state. The super state is basically composed of any type of information with a special `neuroglancer` key which holds a reference towards the Neuroglancer state. The way to access the current super state is to use the `currentState()` function that gives you the uncompressed, already parsed super state and inner state of neuroglancer.

```typescript
const state = currentState()

state.neuroglancer // access neuroglancer state
state.x // access the "x" information from the super state
```

On the current implementation, `currentState()` can return either the super state, or a the neuroglancer state only depending on the current window hash (or any hash passed as parameter). This means that the user needs to test if the `neuroglancer` key exists in the object before using it to know if it's a super state or/and to access neuroglancer state. To have a consistent access to either the super state or the Neuroglancer's state, there is two other functions that can be used:

```typescript
currentNeuroglancerState() // access neuroglancer state
currentSuperState() // access the super state
```

If for some reasons, when calling `currentSuperState` the super state actually doesn't exist for the current hash (or the hash passed as parameter of the function), then a new empty super state wrapping the Neuroglancer's state is created.

## How to update the state and super state of Neuroglancer

To change the state of Neuroglancer from "outside" Neuroglancer", i.e: without having to modify Neuroglancer code to introduce new actions, this project provides the `updateState(...)` function which takes a callback as parameter receiving the super state as parameter. Here is an example about how the state can be modified:

```typescript
const toggleVisibility = (layer: any) =>
  !(layer.visible === undefined || layer.visible)

const toggleLayersVisibility = () => {
  updateState((state) => {
    for (const layer of state.neuroglancer.layers) {
      layer.visible = toggleVisibility(layer)
    }
    return state
  })
}
```

This example takes the super state, iterates on all the layers and toggle their visibility.
It's important to note that the state that is returned is the one that will be used as new super state. There is no immutability or nothing imposed, you can modify `state` as input, or make a copy, as long as you return the new state.

# Neuroglancer Viewer

This document covers the neuroglancer package setup, including the fork we use and the installation process.

## Quick Reference

| Property         | Value                                                             |
| ---------------- | ----------------------------------------------------------------- |
| Package Location | `frontend/packages/neuroglancer/`                                 |
| Current Version  | 2.40.1                                                            |
| Fork Source      | [MetaCell/neuroglancer](https://github.com/MetaCell/neuroglancer) |
| Dependency Type  | Local tarball (`.tgz` file)                                       |
| Build Tool       | Vite                                                              |

---

## Overview

Neuroglancer is a WebGL-based viewer for volumetric data. The CryoET Data Portal uses it for 3D visualization of tomograms.

The neuroglancer package in this repository provides:

- Neuroglancer as a React component
- Automatic state hash compression in the URL
- Super state for storing meta-information alongside Neuroglancer state
- Functions to handle state updates and synchronization

For component usage and API details, see the [package README](../../../../packages/neuroglancer/README.md).

---

## Why a Fork?

The CryoET Data Portal uses [MetaCell's fork](https://github.com/MetaCell/neuroglancer) of Google's upstream neuroglancer rather than the [original repository](https://github.com/google/neuroglancer).

**Reasons for using the fork:**

- **CryoET Customizations**: The MetaCell fork includes modifications specifically for compatibility with the CryoET Data Portal
- **Feature Additions**: Custom features and integrations built on top of the base neuroglancer functionality
- **Maintenance**: The fork is maintained with changes relevant to our use case

---

## Installation Process

Due to Node.js version incompatibility between the CryoET project and the MetaCell fork, the neuroglancer dependency cannot be installed directly from the GitHub repository. Instead, we build the package locally and install it from a tarball.

### Building the Tarball

1. Clone the MetaCell fork:

   ```sh
   git clone https://github.com/MetaCell/neuroglancer
   cd neuroglancer
   ```

2. Install dependencies and build:

   ```sh
   npm install
   ```

3. Create the tarball:

   ```sh
   npm pack
   ```

   This generates a file named `neuroglancer-<version>.tgz` in the current directory.

### Installing the Tarball

1. Copy the generated `.tgz` file to the neuroglancer package directory:

   ```sh
   cp neuroglancer-<version>.tgz /path/to/cryoet-data-portal/frontend/packages/neuroglancer/
   ```

2. Update the dependency path in `frontend/packages/neuroglancer/package.json`:

   ```json
   {
     "dependencies": {
       "neuroglancer": "file:./neuroglancer-<version>.tgz"
     }
   }
   ```

3. Run pnpm install from the frontend directory:

   ```sh
   cd frontend
   pnpm install
   ```

---

## Updating the Neuroglancer Version

When updating to a new version of the MetaCell fork:

1. **Clone or pull the latest changes** from the MetaCell fork
2. **Build a new tarball** using the steps above
3. **Remove the old `.tgz` file** from `frontend/packages/neuroglancer/`
4. **Copy the new `.tgz` file** to the same location
5. **Update `package.json`** with the new filename/version
6. **Run `pnpm install`** to update dependencies
7. **Test the integration** to ensure compatibility

---

## Build System Notes

### Why Vite?

Neuroglancer does not support esbuild-based builds (used by Remix). The neuroglancer package uses Vite for bundling instead.

Key Vite configuration details (`vite.config.ts`):

- **Chunk size limit**: 2 MB (allows large Neuroglancer chunks)
- **esbuild target**: ES2022 (supports decorators used in Neuroglancer)
- **Worker format**: ES (required for dynamic imports)
- **neuroglancer excluded from optimization**: Due to `new URL` syntax incompatibility with esbuild

### iFrame Integration

The neuroglancer wrapper uses an iFrame pattern to isolate Neuroglancer from the main application. This approach:

- Synchronizes Neuroglancer's state with the main page URL hash
- Requires serving the wrapper from the same domain (for cross-origin access)

**Important limitation**: Only one Neuroglancer component can be instantiated per page due to the URL hash synchronization mechanism.

### Generated Types

The `NeuroglancerState.ts` file is auto-generated from official Neuroglancer schema files and should never be edited manually. To regenerate:

```sh
pnpm -r generate-interface
```

---

## Troubleshooting

### "Cannot install neuroglancer from GitHub"

This is expected due to Node.js version incompatibility. Follow the [tarball installation process](#installation-process) instead.

### Build fails with esbuild errors

Ensure you're running the build from the neuroglancer package directory with Vite, not from the main data-portal package.

### State synchronization issues

If Neuroglancer state isn't syncing with the URL, verify that:

- The iFrame is served from the same domain as the main application
- Only one Neuroglancer component exists on the page

---

## Related Documentation

- [Package README](../../../../packages/neuroglancer/README.md) - Component usage and API
- [Technology Stack](../../00-foundation/01-technology-stack.md) - Overview of all technologies
- [Component Architecture](01-component-architecture.md) - How components are organized

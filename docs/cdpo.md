---
hide-navigation: true
---

(cdpo)=
# CryoET Data Portal Ontology (CDPO)

The CryoET Data Portal Ontology (CDPO) describes non-biological and non-relevant components observed in cryo-electron tomography (cryo-ET) data, including sample support materials, contamination, artifacts, and fiducial markers.

| Property | Value |
|----------|-------|
| **Prefix** | CDPO |
| **License** | [MIT](https://opensource.org/licenses/MIT) |
| **Upper Ontology** | [BFO 2.0](https://basic-formal-ontology.org/) |
| **Source** | [github.com/uermel/cdpo](https://github.com/uermel/cdpo) |

## Terms

### Sample Support Components

| ID | Name | Definition |
|----|------|------------|
| CDPO:0000002 | sample support component | Any component of the specimen support used in electron microscopy sample preparation. |
| CDPO:0000003 | sample support material | Any component of the specimen support. |
| CDPO:0000004 | electron microscopy grid | Any part of the metal sample support grid of an electron microscopy specimen. |
| CDPO:0000005 | support film | Any part of the thin support applied to an electron microscopy grid. |
| CDPO:0000006 | carbon support film | Any part of the thin support (amorphous carbon, graphene or graphene oxide) applied to an electron microscopy grid. |
| CDPO:0000007 | holey carbon film | Any part of a holey carbon support material on an electron microscopy grid. |
| CDPO:0000008 | lacey carbon film | Any part of a lacey carbon support material on an electron microscopy grid. |
| CDPO:0000009 | gold support film | Any part of the thin support (gold) applied to an electron microscopy grid. |
| CDPO:0000010 | holey gold film | Any part of a holey gold support material on an electron microscopy grid. |
| CDPO:0000011 | support film fragment | Any detached part of the sample support film. |

### Contamination types

| ID | Name | Definition |
|----|------|------------|
| CDPO:0000013 | contamination | Unwanted material deposited on or near the specimen that is not part of the biological sample. |
| CDPO:0000014 | ice particle contamination | Crystalline or amorphous ice particles deposited on the specimen from atmospheric moisture. |
| CDPO:0000015 | sputter particle contamination | Metal or other particles deposited from sputtering during FIB milling or coating processes. |
| CDPO:0000016 | leopard skin contamination | A pattern of contamination or damage characterized by irregular spots on the specimen surface, typically from beam damage or devitrification. |

### Sample Artifact Regions

| ID | Name | Definition |
|----|------|------------|
| CDPO:0000017 | sample artifact region | Any unintended alteration or feature in the specimen caused by sample preparation or imaging. |
| CDPO:0000018 | non-vitreous region | An area of the specimen where the ice has crystallized rather than remaining in a vitrified (amorphous) state. |
| CDPO:0000019 | dose-damaged region | An area of the specimen that has been altered due to excessive electron dose exposure. |
| CDPO:0000021 | curtaining artifact region | Vertical striping pattern in FIB-milled lamellae caused by differential milling rates. |
| CDPO:0000022 | sample tear | Physical discontinuity in the specimen caused by mechanical stress during handling or imaging. |

### Fiducial Markers

| ID | Name | Definition |
|----|------|------------|
| CDPO:0000023 | fiducial marker | A reference marker used for alignment during tomographic reconstruction. |
| CDPO:0000024 | gold fiducial nanoparticle | Gold nanoparticles added to the specimen surface to serve as alignment markers for tomographic reconstruction. |
| CDPO:0000025 | gold CLEM label | Gold particles used as correlative light and electron microscopy markers to identify specific locations. |

### Tomographic Image Artifacts

| ID | Name | Definition |
|----|------|------------|
| CDPO:0000026 | tomographic image artifact | A feature in a tomographic image that arises from data acquisition or processing rather than the specimen itself. |
| CDPO:0000027 | tomographic reconstruction artifact | A feature in the reconstructed tomogram that arises from the reconstruction process rather than the specimen. |
| CDPO:0000028 | unreconstructed region | An area of the tomogram that could not be properly reconstructed, typically due to missing wedge effects. |
| CDPO:0000029 | streak artifact | Linear artifacts radiating from high-contrast features, caused by limited tilt range or alignment errors. |
| CDPO:0000030 | sample charging artifact | Image distortion caused by electrostatic charge accumulation on the specimen. |
| CDPO:0000031 | laser phase plate off-plane artifact | Image artifact resulting from misalignment of the laser phase plate out of the focal plane. |
| CDPO:0000032 | laser phase plate off-node artifact | Image artifact resulting from the laser phase plate being positioned away from the optimal node position. |

### Other

| ID | Name | Definition |
|----|------|------------|
| CDPO:0000001 | sample | The material of interest being studied, typically biological in nature, that is contained within and imaged as part of the specimen. |
| CDPO:0000012 | vacuum region | The empty space surrounding the specimen in the tomogram, representing areas with no material. |
| CDPO:0000020 | protein aggregate | Aggregated or denatured protein material that is not representative of native biological structures. |
| CDPO:0000033 | tomogram edge | The boundary of the reconstructed tomogram volume. |

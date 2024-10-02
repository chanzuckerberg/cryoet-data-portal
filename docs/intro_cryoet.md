---
hide-navigation: true
---

(cryoet-intro)=
# Introduction to CryoET

<div class="centered-quote">
"You can observe a lot by watching..." When it comes to biological machinery <wbr>
you can't see, CryoET promises to let researchers view the whole picture.
</div>

## What is CryoET?

Cryo-electron tomography (CryoET) is a technique that provides researchers with
a 3D view of cells, subcellular components (e.g., organelles), viruses, and
proteins. Detailed 3D image reconstructions generated through CryoET enable
researchers to answer questions that are critical for understanding cellular
function and response, such as:

- How are subcellular components and proteins spatially organized within a cell?
- How do subcellular components and proteins interact with each other?
- How do cells change in response to stress, injury, or disease?
- How do infectious agents interact with host cells?

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="_static/img/intro_movie.mp4" type="video/mp4" />
    <img src="_static/img/intro_movie.png"
      title="Your browser does not support the video tag."
      alt="Cryo-electron tomogram video showing the infection machinery of an intracellular parasite."
      width="90%"
    >
  </video>
  <figcaption>Cryo-electron tomogram of a sectioned spore from the intracellular
  parasite Encephalitozoon intestinalis. The video shows tomographic slices along
  the depth dimension of the volume (left) and voxel segmentations of various parts
  of the infection machinery (right). Encephalitozoon intestinalis is an
  opportunistic human pathogen that uses a harpoon-like apparatus called the polar
  tube to invade host cells. CryoET helped investigate the infection mechanism
  through the polar tube. When activated, the specialized polaroplast organelle
  swells and causes the polar tube to be expelled and catapulted through the host
  cell membrane, allowing injection of infectious material. This
  <a href="https://cryoetdataportal.czscience.com/runs/16039">run</a> is available
  on the CryoET data portal as part of
  <a href="https://cryoetdataportal.czscience.com/datasets/10437">dataset 10437</a>
  and was generously contributed by Usmani et. al as supporting material for
  <a href="https://doi.org/10.1101/2024.07.13.603322">their E. intestinalis study</a>.
  </figcaption>
</figure>

## What makes CryoET special?

Thanks to CryoET, researchers can now bridge the gap between techniques that
enable them to study cells at the micron scale (e.g., light microscopy) and
molecular structures at the atomic-level (e.g., X-ray crystallography). Although
there are other techniques that generate 3D models of subcellular components,
viruses, and proteins, these techniques require isolation of single particles.
CryoET is the only technique that enables researchers to study biological
samples in their native environment at near atomic resolution while providing
context about their location, conformation, and interactions within a cell or
medium. It is a powerful technique that can provide structural information at a
range of resolutions, from whole cells to molecules, including the atomic
structure of particles with resolutions near 3 angstrom (Å; 1 Å = 0.1 nm).

<figure>
  <img src="_static/img/resolution_ranges.png"
    alt="Schematic of resolution ranges achieved by different microscopy and structural determination methods."
    width="75%"
  >
  <figcaption style="width:75%;">Schematic of resolution ranges achieved by different microscopy
  and structural determination methods. Icons highlight cells and biological
  components that can be captured at various resolution ranges. The scale bar
  depicts millimeter (mm) to angstrom (Å) level resolutions.
  </figcaption>
</figure>

## What is the technology behind CryoET?

The main technologies that make CryoET possible are highlighted in its name,
including: **cryo**genic techniques, **electron** microscopy and **tomography**.

### Cryo

Cryo refers to cryogenic freezing techniques that are used to fix samples
without the use of chemical fixatives or stains. Cryo-fixation happens so
quickly that biological material and processes are frozen in their hydrated,
near native state before ice crystals start to form. This flash-freezing
process that preserves the natural structure of the sample in a glass-like
state is known as vitrification because it embeds the sample in amorphous
(vitreous) ice. One of the first steps during CryoET sample preparation is to
"vitrify" samples. Cryo-fixation also protects the sample when exposed to the
high-vacuum environment of the electron microscope.

<figure>
  <img src="_static/img/schematics_vitrification.png"
    alt="Schematic and electron microscopy images showing how vitrification preserves specimens in their native state and fine structural details."
    width="75%"
  >
  <figcaption style="width:75%;">Schematic showcasing how vitrification keeps cells in their
  hydrated, near-native state (top panel) and electron microscope (EM) images of
  the Golgi apparatus (bottom panel) from a chemically fixed cell (A) versus a
  CryoET reconstruction (B). Note that crystalline ice formation damages cell
  membranes and excludes solutes (e.g., salts and sugars) from the ice lattice,
  increasing solute concentrations to lethal levels and causing dehydration.
  When cells are vitrified, cell membranes and solutes remain in their original
  position as water transitions into a glass-like state that prevents molecular
  movement. When looking at the EM images, note the molecular cross bridges
  preserved in the cryoET reconstruction (yellow box) that can’t be observed in
  the chemically preserved sample. Chemically preserved samples lose fine
  biological details due to the staining process. The EM images were originally
  published in a review by <a href="https://www.cell.com/iscience/fulltext/S2589-0042(21)00927-5?_returnURL=https%3A%2F%2Flinkinghub.elsevier.com%2Fretrieve%2Fpii%2FS2589004221009275%3Fshowall%3Dtrue">Hylton and Swulius 2021</a>
  and portrayed in <a href="https://cryoem101.org/chapter-1-et/">CryoET 101</a>.
  </figcaption>
</figure>

### Electron

Electron specifies that CryoET is an electron microscopy technique where an
electron beam interacts with the sample to project an image. Electron microscopy
is used to view and gain structural information about subcellular and viral
components. Electron wavelengths are small enough to interact with these
components and produce images based on those interactions. CryoET falls under
the transmission electron microscopy category, where electrons pass through the
sample and illuminate film or a digital camera. High electron density components
cast stronger shadows than lighter density ones, thus producing a 2D projection
of the material in the sample. Click [here](https://youtu.be/pQc-GrilCiU) for a
video explaining how electron microscopes work.

<figure>
  <img src="_static/img/schematics_transmission.png"
    alt="Schematic of a transmission electron microscope."
  >
  <figcaption>Transmission electron microscope schematic highlighting components
  of the illumination and imaging systems and the electron detection chamber.
  </figcaption>
</figure>

### Tomography

Tomography refers to an imaging technique that provides 3D information of an
object by capturing projection images from multiple angles. CryoET collects 2D
images representing rotational views or tilted projections from a sample. The
collected 2D images, known as a _tilt series_, are then transformed into volume
providing spatial information. Reconstructed 3D images are known as _tomograms_.

<figure>
  <img src="_static/img/schematics_workflow.png"
    alt="Schematic of the CryoET imaging workflow."
    width="85%"
  >
  <figcaption style="width:85%;">Schematic of the CryoET imaging workflow. (A) First, a vitrified
  specimen, depicted here as a cell (gray oval) embedded in an ice slab is
  tilted at a range of angles while an electron beam passes through the sample
  producing projection images. The cell includes three distinct molecular
  components (red, blue, and green objects) (B) Projected images from rotational
  views around a common axis produce a tilt series. (C) Finally, the tilt series
  is computationally aligned and used to reconstruct a 3D map of the imaged
  specimen through back-projection. Image adapted from
  <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5516000/">Galaz-Montoya and Ludtke 2017</a>.
  </figcaption>
</figure>

Computational efforts are continuously optimizing tomogram reconstruction (e.g.,
automation of image pre-processing steps, such as image alignments, and
improving signal-to-noise ratios). High quality tomograms can then be used to
computationally improve the resolution of smaller, repetitive particles within
tomograms to reconstruct their structure. This single particle reconstruction
from tomograms is known as subtomogram averaging. Through subtomogram averaging,
CryoET data can lead to molecular structures with resolutions near 3 Å.

<figure>
  <img src="_static/img/schematics_subtomogram.png"
    alt="Schematic of the subtomogram averaging workflow."
    width="85%"
  >
  <figcaption style="width:85%;">Subtomogram averaging workflow schematic. During subtomogram
  selection, the volumes of repetitive particles representing the same cellular
  component are selected from reconstructed tomograms. In this example,
  repetitive particles are represented by the blue structures and red arrows
  indicate their orientations. Selected subtomograms are then aligned in a way
  that 3D structures can be overlaid for averaging. Averaged subtomograms result
  in high resolution 3D structures. Image adapted from
  <a href="https://blog.delmic.com/subtomogram-averaging-in-the-cryo-et-workflow">Jonker 2020</a>.
  </figcaption>
</figure>

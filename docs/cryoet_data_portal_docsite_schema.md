# Portal Data Schema

What are datasets, runs, and annotations in the Data Portal?

1. A dataset is a community contributed set of image files for tilt series, reconstructed tomograms, and if available, cellular and/or subcellular annotation files. Every dataset contains only one sample type prepared and imaged with the same conditions. The dataset title, such as `S. pombe cryo-FIB lamellae acquired with defocus-only`, summarizes these conditions. Samples can be a cell, tissue or organism; intact organelle; in-vitro mixture of macromolecules or their complex; or in-silico synthetic data, where the experimental conditions are kept constant. Downloading a dataset downloads all files, including all available tilt series, tomograms, and annotations.
2. A run is one experiment, or replicate, associated with a dataset, where all runs in a dataset have the same sample and imaging conditions. Every run contains a collection of all tomography data and annotations related to imaging one physical location in a sample. It typically contains one tilt series and all associated data (e.g. movie frames, tilt series image stack, tomograms, annotations, and metadata), but in some cases, it may be a set of tilt series that form a mosaic. When downloading a run, you may download only the tomograms or the tomograms and available annotations.
3. An annotation is a point or segmentation indicating the location of a macromolecular complex in the tomogram. On the run page, you may choose to download tomograms with their annotations.

Descriptions of all terminology and metadata used in the portal is provided [here](https://docs.google.com/document/d/11h0u3YYF1EWCTjxu3ObShx26HgLAfJhn9I_tIaeQ6GI/edit#?usp=sharing).

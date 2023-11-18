# Portal Data Schema

What are datasets, runs, and annotations in the Data Portal?

1. A dataset is a community contributed set of image files for tilt series, reconstructed tomograms, and if available, cellular and/or subcellular annotation files. Every dataset contains only one sample type prepared and imaged with the same conditions. The dataset title, such as `S. pombe cryo-FIB lamellae acquired with defocus-only`, summarizes these conditions. Samples can be a cell, tissue or organism; intact organelle; in-vitro mixture of macromolecules or their complex; or in-silico synthetic data, where the experimental conditions are kept constant. Downloading a dataset downloads all files, including all avilable tilt series, tomograms, and annotations.
2. A run is one experiment, or replicate, associated with a dataset, where all runs in a dataset are of the sample type, sample preparation, and imaging configuration. Typically a run produces only one tilt series. However, for a single tilt series, there can be multiple tomograms, each corresponding to the specific algorithm used to process the raw data. When downloading a run, you may download only the tomograms or the tomograms and available annotations.
3. An annotation is a point or segmentation indicating the location of a macromolecular complex in the tomogram. All tomograms in the Data Portal have point annotations of (at least one) macromolecular complex, such an a ribosome. On the run page, you may choose to download tomograms with their annotations.

Descriptions of all terminology and metadata used in the portal is provided [here](https://docs.google.com/document/d/11h0u3YYF1EWCTjxu3ObShx26HgLAfJhn9I_tIaeQ6GI/edit#?usp=sharing).

export interface Annotation {
  depositionId: number
  httpsMetadataPath: string
  deposition: {
    title: string
  }
}

export interface Annotations {
  edges: [
    {
      node: Annotation
    },
  ]
}

export interface Run {
  id: number
  name?: string
  dataset: {
    id: number
    title: string
  }
  annotations: Annotations
}

export interface Tomogram {
  id: string
  name?: string
  run: Run
  dataset: string
  neuroglancerConfig: string
}

/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date with time (isoformat) */
  DateTime: { input: any; output: any; }
  /** The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID. */
  GlobalID: { input: any; output: any; }
};

/** Tiltseries Alignment */
export type Alignment = EntityInterface & Node & {
  __typename?: 'Alignment';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  /** A placeholder for the affine transformation matrix. */
  affineTransformationMatrix?: Maybe<Scalars['String']['output']>;
  /** Type of alignment included, i.e. is a non-rigid alignment included? */
  alignmentType?: Maybe<Alignment_Type_Enum>;
  annotationFiles: AnnotationFileConnection;
  annotationFilesAggregate?: Maybe<AnnotationFileAggregate>;
  deposition?: Maybe<Deposition>;
  depositionId?: Maybe<Scalars['Int']['output']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** Path to the local alignment file */
  localAlignmentFile?: Maybe<Scalars['String']['output']>;
  perSectionAlignments: PerSectionAlignmentParametersConnection;
  perSectionAlignmentsAggregate?: Maybe<PerSectionAlignmentParametersAggregate>;
  run?: Maybe<Run>;
  runId?: Maybe<Scalars['Int']['output']>;
  /** Additional tilt offset in degrees */
  tiltOffset?: Maybe<Scalars['Float']['output']>;
  tiltseries?: Maybe<Tiltseries>;
  tiltseriesId?: Maybe<Scalars['Int']['output']>;
  tomograms: TomogramConnection;
  tomogramsAggregate?: Maybe<TomogramAggregate>;
  /** X dimension of the reconstruction volume in angstrom */
  volumeXDimension?: Maybe<Scalars['Float']['output']>;
  /** X shift of the reconstruction volume in angstrom */
  volumeXOffset?: Maybe<Scalars['Float']['output']>;
  /** Y dimension of the reconstruction volume in angstrom */
  volumeYDimension?: Maybe<Scalars['Float']['output']>;
  /** Y shift of the reconstruction volume in angstrom */
  volumeYOffset?: Maybe<Scalars['Float']['output']>;
  /** Z dimension of the reconstruction volume in angstrom */
  volumeZDimension?: Maybe<Scalars['Float']['output']>;
  /** Z shift of the reconstruction volume in angstrom */
  volumeZOffset?: Maybe<Scalars['Float']['output']>;
  /** Additional X rotation of the reconstruction volume in degrees */
  xRotationOffset?: Maybe<Scalars['Float']['output']>;
};


/** Tiltseries Alignment */
export type AlignmentAnnotationFilesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AnnotationFileOrderByClause>>;
  where?: InputMaybe<AnnotationFileWhereClause>;
};


/** Tiltseries Alignment */
export type AlignmentAnnotationFilesAggregateArgs = {
  where?: InputMaybe<AnnotationFileWhereClause>;
};


/** Tiltseries Alignment */
export type AlignmentDepositionArgs = {
  orderBy?: InputMaybe<Array<DepositionOrderByClause>>;
  where?: InputMaybe<DepositionWhereClause>;
};


/** Tiltseries Alignment */
export type AlignmentPerSectionAlignmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PerSectionAlignmentParametersOrderByClause>>;
  where?: InputMaybe<PerSectionAlignmentParametersWhereClause>;
};


/** Tiltseries Alignment */
export type AlignmentPerSectionAlignmentsAggregateArgs = {
  where?: InputMaybe<PerSectionAlignmentParametersWhereClause>;
};


/** Tiltseries Alignment */
export type AlignmentRunArgs = {
  orderBy?: InputMaybe<Array<RunOrderByClause>>;
  where?: InputMaybe<RunWhereClause>;
};


/** Tiltseries Alignment */
export type AlignmentTiltseriesArgs = {
  orderBy?: InputMaybe<Array<TiltseriesOrderByClause>>;
  where?: InputMaybe<TiltseriesWhereClause>;
};


/** Tiltseries Alignment */
export type AlignmentTomogramsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TomogramOrderByClause>>;
  where?: InputMaybe<TomogramWhereClause>;
};


/** Tiltseries Alignment */
export type AlignmentTomogramsAggregateArgs = {
  where?: InputMaybe<TomogramWhereClause>;
};

export type AlignmentAggregate = {
  __typename?: 'AlignmentAggregate';
  aggregate?: Maybe<Array<AlignmentAggregateFunctions>>;
};

export type AlignmentAggregateFunctions = {
  __typename?: 'AlignmentAggregateFunctions';
  avg?: Maybe<AlignmentNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<AlignmentGroupByOptions>;
  max?: Maybe<AlignmentMinMaxColumns>;
  min?: Maybe<AlignmentMinMaxColumns>;
  stddev?: Maybe<AlignmentNumericalColumns>;
  sum?: Maybe<AlignmentNumericalColumns>;
  variance?: Maybe<AlignmentNumericalColumns>;
};


export type AlignmentAggregateFunctionsCountArgs = {
  columns?: InputMaybe<AlignmentCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type AlignmentConnection = {
  __typename?: 'AlignmentConnection';
  /** Contains the nodes in this connection */
  edges: Array<AlignmentEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum AlignmentCountColumns {
  AffineTransformationMatrix = 'affineTransformationMatrix',
  AlignmentType = 'alignmentType',
  AnnotationFiles = 'annotationFiles',
  Deposition = 'deposition',
  Id = 'id',
  LocalAlignmentFile = 'localAlignmentFile',
  PerSectionAlignments = 'perSectionAlignments',
  Run = 'run',
  TiltOffset = 'tiltOffset',
  Tiltseries = 'tiltseries',
  Tomograms = 'tomograms',
  VolumeXDimension = 'volumeXDimension',
  VolumeXOffset = 'volumeXOffset',
  VolumeYDimension = 'volumeYDimension',
  VolumeYOffset = 'volumeYOffset',
  VolumeZDimension = 'volumeZDimension',
  VolumeZOffset = 'volumeZOffset',
  XRotationOffset = 'xRotationOffset'
}

export type AlignmentCreateInput = {
  /** A placeholder for the affine transformation matrix. */
  affineTransformationMatrix?: InputMaybe<Scalars['String']['input']>;
  /** Type of alignment included, i.e. is a non-rigid alignment included? */
  alignmentType?: InputMaybe<Alignment_Type_Enum>;
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** Path to the local alignment file */
  localAlignmentFile?: InputMaybe<Scalars['String']['input']>;
  runId?: InputMaybe<Scalars['ID']['input']>;
  /** Additional tilt offset in degrees */
  tiltOffset?: InputMaybe<Scalars['Float']['input']>;
  tiltseriesId?: InputMaybe<Scalars['ID']['input']>;
  /** X dimension of the reconstruction volume in angstrom */
  volumeXDimension?: InputMaybe<Scalars['Float']['input']>;
  /** X shift of the reconstruction volume in angstrom */
  volumeXOffset?: InputMaybe<Scalars['Float']['input']>;
  /** Y dimension of the reconstruction volume in angstrom */
  volumeYDimension?: InputMaybe<Scalars['Float']['input']>;
  /** Y shift of the reconstruction volume in angstrom */
  volumeYOffset?: InputMaybe<Scalars['Float']['input']>;
  /** Z dimension of the reconstruction volume in angstrom */
  volumeZDimension?: InputMaybe<Scalars['Float']['input']>;
  /** Z shift of the reconstruction volume in angstrom */
  volumeZOffset?: InputMaybe<Scalars['Float']['input']>;
  /** Additional X rotation of the reconstruction volume in degrees */
  xRotationOffset?: InputMaybe<Scalars['Float']['input']>;
};

/** An edge in a connection. */
export type AlignmentEdge = {
  __typename?: 'AlignmentEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Alignment;
};

export type AlignmentGroupByOptions = {
  __typename?: 'AlignmentGroupByOptions';
  affineTransformationMatrix?: Maybe<Scalars['String']['output']>;
  alignmentType?: Maybe<Alignment_Type_Enum>;
  deposition?: Maybe<DepositionGroupByOptions>;
  id?: Maybe<Scalars['Int']['output']>;
  localAlignmentFile?: Maybe<Scalars['String']['output']>;
  run?: Maybe<RunGroupByOptions>;
  tiltOffset?: Maybe<Scalars['Float']['output']>;
  tiltseries?: Maybe<TiltseriesGroupByOptions>;
  volumeXDimension?: Maybe<Scalars['Float']['output']>;
  volumeXOffset?: Maybe<Scalars['Float']['output']>;
  volumeYDimension?: Maybe<Scalars['Float']['output']>;
  volumeYOffset?: Maybe<Scalars['Float']['output']>;
  volumeZDimension?: Maybe<Scalars['Float']['output']>;
  volumeZOffset?: Maybe<Scalars['Float']['output']>;
  xRotationOffset?: Maybe<Scalars['Float']['output']>;
};

export type AlignmentMinMaxColumns = {
  __typename?: 'AlignmentMinMaxColumns';
  affineTransformationMatrix?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  localAlignmentFile?: Maybe<Scalars['String']['output']>;
  tiltOffset?: Maybe<Scalars['Float']['output']>;
  volumeXDimension?: Maybe<Scalars['Float']['output']>;
  volumeXOffset?: Maybe<Scalars['Float']['output']>;
  volumeYDimension?: Maybe<Scalars['Float']['output']>;
  volumeYOffset?: Maybe<Scalars['Float']['output']>;
  volumeZDimension?: Maybe<Scalars['Float']['output']>;
  volumeZOffset?: Maybe<Scalars['Float']['output']>;
  xRotationOffset?: Maybe<Scalars['Float']['output']>;
};

export type AlignmentNumericalColumns = {
  __typename?: 'AlignmentNumericalColumns';
  id?: Maybe<Scalars['Int']['output']>;
  tiltOffset?: Maybe<Scalars['Float']['output']>;
  volumeXDimension?: Maybe<Scalars['Float']['output']>;
  volumeXOffset?: Maybe<Scalars['Float']['output']>;
  volumeYDimension?: Maybe<Scalars['Float']['output']>;
  volumeYOffset?: Maybe<Scalars['Float']['output']>;
  volumeZDimension?: Maybe<Scalars['Float']['output']>;
  volumeZOffset?: Maybe<Scalars['Float']['output']>;
  xRotationOffset?: Maybe<Scalars['Float']['output']>;
};

export type AlignmentOrderByClause = {
  affineTransformationMatrix?: InputMaybe<OrderBy>;
  alignmentType?: InputMaybe<OrderBy>;
  deposition?: InputMaybe<DepositionOrderByClause>;
  id?: InputMaybe<OrderBy>;
  localAlignmentFile?: InputMaybe<OrderBy>;
  run?: InputMaybe<RunOrderByClause>;
  tiltOffset?: InputMaybe<OrderBy>;
  tiltseries?: InputMaybe<TiltseriesOrderByClause>;
  volumeXDimension?: InputMaybe<OrderBy>;
  volumeXOffset?: InputMaybe<OrderBy>;
  volumeYDimension?: InputMaybe<OrderBy>;
  volumeYOffset?: InputMaybe<OrderBy>;
  volumeZDimension?: InputMaybe<OrderBy>;
  volumeZOffset?: InputMaybe<OrderBy>;
  xRotationOffset?: InputMaybe<OrderBy>;
};

export type AlignmentUpdateInput = {
  /** A placeholder for the affine transformation matrix. */
  affineTransformationMatrix?: InputMaybe<Scalars['String']['input']>;
  /** Type of alignment included, i.e. is a non-rigid alignment included? */
  alignmentType?: InputMaybe<Alignment_Type_Enum>;
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Path to the local alignment file */
  localAlignmentFile?: InputMaybe<Scalars['String']['input']>;
  runId?: InputMaybe<Scalars['ID']['input']>;
  /** Additional tilt offset in degrees */
  tiltOffset?: InputMaybe<Scalars['Float']['input']>;
  tiltseriesId?: InputMaybe<Scalars['ID']['input']>;
  /** X dimension of the reconstruction volume in angstrom */
  volumeXDimension?: InputMaybe<Scalars['Float']['input']>;
  /** X shift of the reconstruction volume in angstrom */
  volumeXOffset?: InputMaybe<Scalars['Float']['input']>;
  /** Y dimension of the reconstruction volume in angstrom */
  volumeYDimension?: InputMaybe<Scalars['Float']['input']>;
  /** Y shift of the reconstruction volume in angstrom */
  volumeYOffset?: InputMaybe<Scalars['Float']['input']>;
  /** Z dimension of the reconstruction volume in angstrom */
  volumeZDimension?: InputMaybe<Scalars['Float']['input']>;
  /** Z shift of the reconstruction volume in angstrom */
  volumeZOffset?: InputMaybe<Scalars['Float']['input']>;
  /** Additional X rotation of the reconstruction volume in degrees */
  xRotationOffset?: InputMaybe<Scalars['Float']['input']>;
};

export type AlignmentWhereClause = {
  affineTransformationMatrix?: InputMaybe<StrComparators>;
  alignmentType?: InputMaybe<Alignment_Type_EnumEnumComparators>;
  annotationFiles?: InputMaybe<AnnotationFileWhereClause>;
  deposition?: InputMaybe<DepositionWhereClause>;
  id?: InputMaybe<IntComparators>;
  localAlignmentFile?: InputMaybe<StrComparators>;
  perSectionAlignments?: InputMaybe<PerSectionAlignmentParametersWhereClause>;
  run?: InputMaybe<RunWhereClause>;
  tiltOffset?: InputMaybe<FloatComparators>;
  tiltseries?: InputMaybe<TiltseriesWhereClause>;
  tomograms?: InputMaybe<TomogramWhereClause>;
  volumeXDimension?: InputMaybe<FloatComparators>;
  volumeXOffset?: InputMaybe<FloatComparators>;
  volumeYDimension?: InputMaybe<FloatComparators>;
  volumeYOffset?: InputMaybe<FloatComparators>;
  volumeZDimension?: InputMaybe<FloatComparators>;
  volumeZOffset?: InputMaybe<FloatComparators>;
  xRotationOffset?: InputMaybe<FloatComparators>;
};

export type AlignmentWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type Alignment_Type_EnumEnumComparators = {
  _eq?: InputMaybe<Alignment_Type_Enum>;
  _gt?: InputMaybe<Alignment_Type_Enum>;
  _gte?: InputMaybe<Alignment_Type_Enum>;
  _in?: InputMaybe<Array<Alignment_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Alignment_Type_Enum>;
  _lte?: InputMaybe<Alignment_Type_Enum>;
  _neq?: InputMaybe<Alignment_Type_Enum>;
  _nin?: InputMaybe<Array<Alignment_Type_Enum>>;
};

/** Metadata about an annotation for a run */
export type Annotation = EntityInterface & Node & {
  __typename?: 'Annotation';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  /** Describe how the annotation is made (e.g. Manual, crYoLO, Positive Unlabeled Learning, template matching) */
  annotationMethod: Scalars['String']['output'];
  /** List of publication IDs (EMPIAR, EMDB, DOI) that describe this annotation method. Comma separated. */
  annotationPublication?: Maybe<Scalars['String']['output']>;
  annotationShapes: AnnotationShapeConnection;
  annotationShapesAggregate?: Maybe<AnnotationShapeAggregate>;
  /** Software used for generating this annotation */
  annotationSoftware?: Maybe<Scalars['String']['output']>;
  authors: AnnotationAuthorConnection;
  authorsAggregate?: Maybe<AnnotationAuthorAggregate>;
  /** Describe the confidence level of the annotation. Precision is defined as the % of annotation objects being true positive */
  confidencePrecision?: Maybe<Scalars['Float']['output']>;
  /** Describe the confidence level of the annotation. Recall is defined as the % of true positives being annotated correctly */
  confidenceRecall?: Maybe<Scalars['Float']['output']>;
  deposition?: Maybe<Deposition>;
  /** The date a data item was received by the cryoET data portal. */
  depositionDate: Scalars['DateTime']['output'];
  depositionId?: Maybe<Scalars['Int']['output']>;
  /** Whether an annotation is considered ground truth, as determined by the annotator. */
  groundTruthStatus?: Maybe<Scalars['Boolean']['output']>;
  /** Annotation filename used as ground truth for precision and recall */
  groundTruthUsed?: Maybe<Scalars['String']['output']>;
  /** Path to the file as an https url */
  httpsMetadataPath: Scalars['String']['output'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** This annotation is recommended by the curator to be preferred for this object type. */
  isCuratorRecommended?: Maybe<Scalars['Boolean']['output']>;
  /** The date a piece of data was last modified on the cryoET data portal. */
  lastModifiedDate: Scalars['DateTime']['output'];
  /** Classification of the annotation method based on supervision. */
  methodType: Annotation_Method_Type_Enum;
  /** Number of objects identified */
  objectCount?: Maybe<Scalars['Int']['output']>;
  /** A textual description of the annotation object, can be a longer description to include additional information not covered by the Annotation object name and state. */
  objectDescription?: Maybe<Scalars['String']['output']>;
  /** Gene Ontology Cellular Component identifier for the annotation object */
  objectId: Scalars['String']['output'];
  /** Name of the object being annotated (e.g. ribosome, nuclear pore complex, actin filament, membrane) */
  objectName: Scalars['String']['output'];
  /** Molecule state annotated (e.g. open, closed) */
  objectState?: Maybe<Scalars['String']['output']>;
  /** The date a data item was received by the cryoET data portal. */
  releaseDate: Scalars['DateTime']['output'];
  run?: Maybe<Run>;
  runId?: Maybe<Scalars['Int']['output']>;
  /** Path to the file in s3 */
  s3MetadataPath: Scalars['String']['output'];
};


/** Metadata about an annotation for a run */
export type AnnotationAnnotationShapesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AnnotationShapeOrderByClause>>;
  where?: InputMaybe<AnnotationShapeWhereClause>;
};


/** Metadata about an annotation for a run */
export type AnnotationAnnotationShapesAggregateArgs = {
  where?: InputMaybe<AnnotationShapeWhereClause>;
};


/** Metadata about an annotation for a run */
export type AnnotationAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AnnotationAuthorOrderByClause>>;
  where?: InputMaybe<AnnotationAuthorWhereClause>;
};


/** Metadata about an annotation for a run */
export type AnnotationAuthorsAggregateArgs = {
  where?: InputMaybe<AnnotationAuthorWhereClause>;
};


/** Metadata about an annotation for a run */
export type AnnotationDepositionArgs = {
  orderBy?: InputMaybe<Array<DepositionOrderByClause>>;
  where?: InputMaybe<DepositionWhereClause>;
};


/** Metadata about an annotation for a run */
export type AnnotationRunArgs = {
  orderBy?: InputMaybe<Array<RunOrderByClause>>;
  where?: InputMaybe<RunWhereClause>;
};

export type AnnotationAggregate = {
  __typename?: 'AnnotationAggregate';
  aggregate?: Maybe<Array<AnnotationAggregateFunctions>>;
};

export type AnnotationAggregateFunctions = {
  __typename?: 'AnnotationAggregateFunctions';
  avg?: Maybe<AnnotationNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<AnnotationGroupByOptions>;
  max?: Maybe<AnnotationMinMaxColumns>;
  min?: Maybe<AnnotationMinMaxColumns>;
  stddev?: Maybe<AnnotationNumericalColumns>;
  sum?: Maybe<AnnotationNumericalColumns>;
  variance?: Maybe<AnnotationNumericalColumns>;
};


export type AnnotationAggregateFunctionsCountArgs = {
  columns?: InputMaybe<AnnotationCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Author of an annotation */
export type AnnotationAuthor = EntityInterface & Node & {
  __typename?: 'AnnotationAuthor';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  /** The address of the author's affiliation. */
  affiliationAddress?: Maybe<Scalars['String']['output']>;
  /** A Research Organization Registry (ROR) identifier. */
  affiliationIdentifier?: Maybe<Scalars['String']['output']>;
  /** The name of the author's affiliation. */
  affiliationName?: Maybe<Scalars['String']['output']>;
  annotation?: Maybe<Annotation>;
  annotationId?: Maybe<Scalars['Int']['output']>;
  /** The order that the author is listed as in the associated publication */
  authorListOrder: Scalars['Int']['output'];
  /** Whether the author is a corresponding author. */
  correspondingAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
  /** The email address of the author. */
  email?: Maybe<Scalars['String']['output']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** The full name of the author. */
  name: Scalars['String']['output'];
  /** The ORCID identifier for the author. */
  orcid?: Maybe<Scalars['String']['output']>;
  /** Whether the author is a primary author. */
  primaryAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
};


/** Author of an annotation */
export type AnnotationAuthorAnnotationArgs = {
  orderBy?: InputMaybe<Array<AnnotationOrderByClause>>;
  where?: InputMaybe<AnnotationWhereClause>;
};

export type AnnotationAuthorAggregate = {
  __typename?: 'AnnotationAuthorAggregate';
  aggregate?: Maybe<Array<AnnotationAuthorAggregateFunctions>>;
};

export type AnnotationAuthorAggregateFunctions = {
  __typename?: 'AnnotationAuthorAggregateFunctions';
  avg?: Maybe<AnnotationAuthorNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<AnnotationAuthorGroupByOptions>;
  max?: Maybe<AnnotationAuthorMinMaxColumns>;
  min?: Maybe<AnnotationAuthorMinMaxColumns>;
  stddev?: Maybe<AnnotationAuthorNumericalColumns>;
  sum?: Maybe<AnnotationAuthorNumericalColumns>;
  variance?: Maybe<AnnotationAuthorNumericalColumns>;
};


export type AnnotationAuthorAggregateFunctionsCountArgs = {
  columns?: InputMaybe<AnnotationAuthorCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type AnnotationAuthorConnection = {
  __typename?: 'AnnotationAuthorConnection';
  /** Contains the nodes in this connection */
  edges: Array<AnnotationAuthorEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum AnnotationAuthorCountColumns {
  AffiliationAddress = 'affiliationAddress',
  AffiliationIdentifier = 'affiliationIdentifier',
  AffiliationName = 'affiliationName',
  Annotation = 'annotation',
  AuthorListOrder = 'authorListOrder',
  CorrespondingAuthorStatus = 'correspondingAuthorStatus',
  Email = 'email',
  Id = 'id',
  Name = 'name',
  Orcid = 'orcid',
  PrimaryAuthorStatus = 'primaryAuthorStatus'
}

export type AnnotationAuthorCreateInput = {
  /** The address of the author's affiliation. */
  affiliationAddress?: InputMaybe<Scalars['String']['input']>;
  /** A Research Organization Registry (ROR) identifier. */
  affiliationIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the author's affiliation. */
  affiliationName?: InputMaybe<Scalars['String']['input']>;
  /** Metadata about an annotation for a run */
  annotationId?: InputMaybe<Scalars['ID']['input']>;
  /** The order that the author is listed as in the associated publication */
  authorListOrder: Scalars['Int']['input'];
  /** Whether the author is a corresponding author. */
  correspondingAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
  /** The email address of the author. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** The full name of the author. */
  name: Scalars['String']['input'];
  /** The ORCID identifier for the author. */
  orcid?: InputMaybe<Scalars['String']['input']>;
  /** Whether the author is a primary author. */
  primaryAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An edge in a connection. */
export type AnnotationAuthorEdge = {
  __typename?: 'AnnotationAuthorEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: AnnotationAuthor;
};

export type AnnotationAuthorGroupByOptions = {
  __typename?: 'AnnotationAuthorGroupByOptions';
  affiliationAddress?: Maybe<Scalars['String']['output']>;
  affiliationIdentifier?: Maybe<Scalars['String']['output']>;
  affiliationName?: Maybe<Scalars['String']['output']>;
  annotation?: Maybe<AnnotationGroupByOptions>;
  authorListOrder?: Maybe<Scalars['Int']['output']>;
  correspondingAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  orcid?: Maybe<Scalars['String']['output']>;
  primaryAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
};

export type AnnotationAuthorMinMaxColumns = {
  __typename?: 'AnnotationAuthorMinMaxColumns';
  affiliationAddress?: Maybe<Scalars['String']['output']>;
  affiliationIdentifier?: Maybe<Scalars['String']['output']>;
  affiliationName?: Maybe<Scalars['String']['output']>;
  authorListOrder?: Maybe<Scalars['Int']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  orcid?: Maybe<Scalars['String']['output']>;
};

export type AnnotationAuthorNumericalColumns = {
  __typename?: 'AnnotationAuthorNumericalColumns';
  authorListOrder?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type AnnotationAuthorOrderByClause = {
  affiliationAddress?: InputMaybe<OrderBy>;
  affiliationIdentifier?: InputMaybe<OrderBy>;
  affiliationName?: InputMaybe<OrderBy>;
  annotation?: InputMaybe<AnnotationOrderByClause>;
  authorListOrder?: InputMaybe<OrderBy>;
  correspondingAuthorStatus?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  orcid?: InputMaybe<OrderBy>;
  primaryAuthorStatus?: InputMaybe<OrderBy>;
};

export type AnnotationAuthorUpdateInput = {
  /** The address of the author's affiliation. */
  affiliationAddress?: InputMaybe<Scalars['String']['input']>;
  /** A Research Organization Registry (ROR) identifier. */
  affiliationIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the author's affiliation. */
  affiliationName?: InputMaybe<Scalars['String']['input']>;
  /** Metadata about an annotation for a run */
  annotationId?: InputMaybe<Scalars['ID']['input']>;
  /** The order that the author is listed as in the associated publication */
  authorListOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Whether the author is a corresponding author. */
  correspondingAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
  /** The email address of the author. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** The full name of the author. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The ORCID identifier for the author. */
  orcid?: InputMaybe<Scalars['String']['input']>;
  /** Whether the author is a primary author. */
  primaryAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AnnotationAuthorWhereClause = {
  affiliationAddress?: InputMaybe<StrComparators>;
  affiliationIdentifier?: InputMaybe<StrComparators>;
  affiliationName?: InputMaybe<StrComparators>;
  annotation?: InputMaybe<AnnotationWhereClause>;
  authorListOrder?: InputMaybe<IntComparators>;
  correspondingAuthorStatus?: InputMaybe<BoolComparators>;
  email?: InputMaybe<StrComparators>;
  id?: InputMaybe<IntComparators>;
  name?: InputMaybe<StrComparators>;
  orcid?: InputMaybe<StrComparators>;
  primaryAuthorStatus?: InputMaybe<BoolComparators>;
};

export type AnnotationAuthorWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

/** A connection to a list of items. */
export type AnnotationConnection = {
  __typename?: 'AnnotationConnection';
  /** Contains the nodes in this connection */
  edges: Array<AnnotationEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum AnnotationCountColumns {
  AnnotationMethod = 'annotationMethod',
  AnnotationPublication = 'annotationPublication',
  AnnotationShapes = 'annotationShapes',
  AnnotationSoftware = 'annotationSoftware',
  Authors = 'authors',
  ConfidencePrecision = 'confidencePrecision',
  ConfidenceRecall = 'confidenceRecall',
  Deposition = 'deposition',
  DepositionDate = 'depositionDate',
  GroundTruthStatus = 'groundTruthStatus',
  GroundTruthUsed = 'groundTruthUsed',
  HttpsMetadataPath = 'httpsMetadataPath',
  Id = 'id',
  IsCuratorRecommended = 'isCuratorRecommended',
  LastModifiedDate = 'lastModifiedDate',
  MethodType = 'methodType',
  ObjectCount = 'objectCount',
  ObjectDescription = 'objectDescription',
  ObjectId = 'objectId',
  ObjectName = 'objectName',
  ObjectState = 'objectState',
  ReleaseDate = 'releaseDate',
  Run = 'run',
  S3MetadataPath = 's3MetadataPath'
}

export type AnnotationCreateInput = {
  /** Describe how the annotation is made (e.g. Manual, crYoLO, Positive Unlabeled Learning, template matching) */
  annotationMethod: Scalars['String']['input'];
  /** List of publication IDs (EMPIAR, EMDB, DOI) that describe this annotation method. Comma separated. */
  annotationPublication?: InputMaybe<Scalars['String']['input']>;
  /** Software used for generating this annotation */
  annotationSoftware?: InputMaybe<Scalars['String']['input']>;
  /** Describe the confidence level of the annotation. Precision is defined as the % of annotation objects being true positive */
  confidencePrecision?: InputMaybe<Scalars['Float']['input']>;
  /** Describe the confidence level of the annotation. Recall is defined as the % of true positives being annotated correctly */
  confidenceRecall?: InputMaybe<Scalars['Float']['input']>;
  /** The date a data item was received by the cryoET data portal. */
  depositionDate: Scalars['DateTime']['input'];
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** Whether an annotation is considered ground truth, as determined by the annotator. */
  groundTruthStatus?: InputMaybe<Scalars['Boolean']['input']>;
  /** Annotation filename used as ground truth for precision and recall */
  groundTruthUsed?: InputMaybe<Scalars['String']['input']>;
  /** Path to the file as an https url */
  httpsMetadataPath: Scalars['String']['input'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** This annotation is recommended by the curator to be preferred for this object type. */
  isCuratorRecommended?: InputMaybe<Scalars['Boolean']['input']>;
  /** The date a piece of data was last modified on the cryoET data portal. */
  lastModifiedDate: Scalars['DateTime']['input'];
  /** Classification of the annotation method based on supervision. */
  methodType: Annotation_Method_Type_Enum;
  /** Number of objects identified */
  objectCount?: InputMaybe<Scalars['Int']['input']>;
  /** A textual description of the annotation object, can be a longer description to include additional information not covered by the Annotation object name and state. */
  objectDescription?: InputMaybe<Scalars['String']['input']>;
  /** Gene Ontology Cellular Component identifier for the annotation object */
  objectId: Scalars['String']['input'];
  /** Name of the object being annotated (e.g. ribosome, nuclear pore complex, actin filament, membrane) */
  objectName: Scalars['String']['input'];
  /** Molecule state annotated (e.g. open, closed) */
  objectState?: InputMaybe<Scalars['String']['input']>;
  /** The date a data item was received by the cryoET data portal. */
  releaseDate: Scalars['DateTime']['input'];
  runId?: InputMaybe<Scalars['ID']['input']>;
  /** Path to the file in s3 */
  s3MetadataPath: Scalars['String']['input'];
};

/** An edge in a connection. */
export type AnnotationEdge = {
  __typename?: 'AnnotationEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Annotation;
};

/** Files associated with an annotation */
export type AnnotationFile = EntityInterface & Node & {
  __typename?: 'AnnotationFile';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  alignment?: Maybe<Alignment>;
  alignmentId?: Maybe<Scalars['Int']['output']>;
  annotationShape?: Maybe<AnnotationShape>;
  annotationShapeId?: Maybe<Scalars['Int']['output']>;
  /** File format label */
  format: Scalars['String']['output'];
  /** Path to the file as an https url */
  httpsPath: Scalars['String']['output'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** This annotation will be rendered in neuroglancer by default. */
  isVisualizationDefault?: Maybe<Scalars['Boolean']['output']>;
  /** Path to the file in s3 */
  s3Path: Scalars['String']['output'];
  /** The source type for the annotation file */
  source?: Maybe<Annotation_File_Source_Enum>;
  tomogramVoxelSpacing?: Maybe<TomogramVoxelSpacing>;
  tomogramVoxelSpacingId?: Maybe<Scalars['Int']['output']>;
};


/** Files associated with an annotation */
export type AnnotationFileAlignmentArgs = {
  orderBy?: InputMaybe<Array<AlignmentOrderByClause>>;
  where?: InputMaybe<AlignmentWhereClause>;
};


/** Files associated with an annotation */
export type AnnotationFileAnnotationShapeArgs = {
  orderBy?: InputMaybe<Array<AnnotationShapeOrderByClause>>;
  where?: InputMaybe<AnnotationShapeWhereClause>;
};


/** Files associated with an annotation */
export type AnnotationFileTomogramVoxelSpacingArgs = {
  orderBy?: InputMaybe<Array<TomogramVoxelSpacingOrderByClause>>;
  where?: InputMaybe<TomogramVoxelSpacingWhereClause>;
};

export type AnnotationFileAggregate = {
  __typename?: 'AnnotationFileAggregate';
  aggregate?: Maybe<Array<AnnotationFileAggregateFunctions>>;
};

export type AnnotationFileAggregateFunctions = {
  __typename?: 'AnnotationFileAggregateFunctions';
  avg?: Maybe<AnnotationFileNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<AnnotationFileGroupByOptions>;
  max?: Maybe<AnnotationFileMinMaxColumns>;
  min?: Maybe<AnnotationFileMinMaxColumns>;
  stddev?: Maybe<AnnotationFileNumericalColumns>;
  sum?: Maybe<AnnotationFileNumericalColumns>;
  variance?: Maybe<AnnotationFileNumericalColumns>;
};


export type AnnotationFileAggregateFunctionsCountArgs = {
  columns?: InputMaybe<AnnotationFileCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type AnnotationFileConnection = {
  __typename?: 'AnnotationFileConnection';
  /** Contains the nodes in this connection */
  edges: Array<AnnotationFileEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum AnnotationFileCountColumns {
  Alignment = 'alignment',
  AnnotationShape = 'annotationShape',
  Format = 'format',
  HttpsPath = 'httpsPath',
  Id = 'id',
  IsVisualizationDefault = 'isVisualizationDefault',
  S3Path = 's3Path',
  Source = 'source',
  TomogramVoxelSpacing = 'tomogramVoxelSpacing'
}

export type AnnotationFileCreateInput = {
  /** Tiltseries Alignment */
  alignmentId?: InputMaybe<Scalars['ID']['input']>;
  /** Shapes associated with an annotation */
  annotationShapeId?: InputMaybe<Scalars['ID']['input']>;
  /** File format label */
  format: Scalars['String']['input'];
  /** Path to the file as an https url */
  httpsPath: Scalars['String']['input'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** This annotation will be rendered in neuroglancer by default. */
  isVisualizationDefault?: InputMaybe<Scalars['Boolean']['input']>;
  /** Path to the file in s3 */
  s3Path: Scalars['String']['input'];
  /** The source type for the annotation file */
  source?: InputMaybe<Annotation_File_Source_Enum>;
  /** Voxel spacings for a run */
  tomogramVoxelSpacingId?: InputMaybe<Scalars['ID']['input']>;
};

/** An edge in a connection. */
export type AnnotationFileEdge = {
  __typename?: 'AnnotationFileEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: AnnotationFile;
};

export type AnnotationFileGroupByOptions = {
  __typename?: 'AnnotationFileGroupByOptions';
  alignment?: Maybe<AlignmentGroupByOptions>;
  annotationShape?: Maybe<AnnotationShapeGroupByOptions>;
  format?: Maybe<Scalars['String']['output']>;
  httpsPath?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  isVisualizationDefault?: Maybe<Scalars['Boolean']['output']>;
  s3Path?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Annotation_File_Source_Enum>;
  tomogramVoxelSpacing?: Maybe<TomogramVoxelSpacingGroupByOptions>;
};

export type AnnotationFileMinMaxColumns = {
  __typename?: 'AnnotationFileMinMaxColumns';
  format?: Maybe<Scalars['String']['output']>;
  httpsPath?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  s3Path?: Maybe<Scalars['String']['output']>;
};

export type AnnotationFileNumericalColumns = {
  __typename?: 'AnnotationFileNumericalColumns';
  id?: Maybe<Scalars['Int']['output']>;
};

export type AnnotationFileOrderByClause = {
  alignment?: InputMaybe<AlignmentOrderByClause>;
  annotationShape?: InputMaybe<AnnotationShapeOrderByClause>;
  format?: InputMaybe<OrderBy>;
  httpsPath?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isVisualizationDefault?: InputMaybe<OrderBy>;
  s3Path?: InputMaybe<OrderBy>;
  source?: InputMaybe<OrderBy>;
  tomogramVoxelSpacing?: InputMaybe<TomogramVoxelSpacingOrderByClause>;
};

export type AnnotationFileUpdateInput = {
  /** Tiltseries Alignment */
  alignmentId?: InputMaybe<Scalars['ID']['input']>;
  /** Shapes associated with an annotation */
  annotationShapeId?: InputMaybe<Scalars['ID']['input']>;
  /** File format label */
  format?: InputMaybe<Scalars['String']['input']>;
  /** Path to the file as an https url */
  httpsPath?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** This annotation will be rendered in neuroglancer by default. */
  isVisualizationDefault?: InputMaybe<Scalars['Boolean']['input']>;
  /** Path to the file in s3 */
  s3Path?: InputMaybe<Scalars['String']['input']>;
  /** The source type for the annotation file */
  source?: InputMaybe<Annotation_File_Source_Enum>;
  /** Voxel spacings for a run */
  tomogramVoxelSpacingId?: InputMaybe<Scalars['ID']['input']>;
};

export type AnnotationFileWhereClause = {
  alignment?: InputMaybe<AlignmentWhereClause>;
  annotationShape?: InputMaybe<AnnotationShapeWhereClause>;
  format?: InputMaybe<StrComparators>;
  httpsPath?: InputMaybe<StrComparators>;
  id?: InputMaybe<IntComparators>;
  isVisualizationDefault?: InputMaybe<BoolComparators>;
  s3Path?: InputMaybe<StrComparators>;
  source?: InputMaybe<Annotation_File_Source_EnumEnumComparators>;
  tomogramVoxelSpacing?: InputMaybe<TomogramVoxelSpacingWhereClause>;
};

export type AnnotationFileWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type AnnotationGroupByOptions = {
  __typename?: 'AnnotationGroupByOptions';
  annotationMethod?: Maybe<Scalars['String']['output']>;
  annotationPublication?: Maybe<Scalars['String']['output']>;
  annotationSoftware?: Maybe<Scalars['String']['output']>;
  confidencePrecision?: Maybe<Scalars['Float']['output']>;
  confidenceRecall?: Maybe<Scalars['Float']['output']>;
  deposition?: Maybe<DepositionGroupByOptions>;
  depositionDate?: Maybe<Scalars['DateTime']['output']>;
  groundTruthStatus?: Maybe<Scalars['Boolean']['output']>;
  groundTruthUsed?: Maybe<Scalars['String']['output']>;
  httpsMetadataPath?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  isCuratorRecommended?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedDate?: Maybe<Scalars['DateTime']['output']>;
  methodType?: Maybe<Annotation_Method_Type_Enum>;
  objectCount?: Maybe<Scalars['Int']['output']>;
  objectDescription?: Maybe<Scalars['String']['output']>;
  objectId?: Maybe<Scalars['String']['output']>;
  objectName?: Maybe<Scalars['String']['output']>;
  objectState?: Maybe<Scalars['String']['output']>;
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
  run?: Maybe<RunGroupByOptions>;
  s3MetadataPath?: Maybe<Scalars['String']['output']>;
};

export type AnnotationMinMaxColumns = {
  __typename?: 'AnnotationMinMaxColumns';
  annotationMethod?: Maybe<Scalars['String']['output']>;
  annotationPublication?: Maybe<Scalars['String']['output']>;
  annotationSoftware?: Maybe<Scalars['String']['output']>;
  confidencePrecision?: Maybe<Scalars['Float']['output']>;
  confidenceRecall?: Maybe<Scalars['Float']['output']>;
  depositionDate?: Maybe<Scalars['DateTime']['output']>;
  groundTruthUsed?: Maybe<Scalars['String']['output']>;
  httpsMetadataPath?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  lastModifiedDate?: Maybe<Scalars['DateTime']['output']>;
  objectCount?: Maybe<Scalars['Int']['output']>;
  objectDescription?: Maybe<Scalars['String']['output']>;
  objectId?: Maybe<Scalars['String']['output']>;
  objectName?: Maybe<Scalars['String']['output']>;
  objectState?: Maybe<Scalars['String']['output']>;
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
  s3MetadataPath?: Maybe<Scalars['String']['output']>;
};

export type AnnotationNumericalColumns = {
  __typename?: 'AnnotationNumericalColumns';
  confidencePrecision?: Maybe<Scalars['Float']['output']>;
  confidenceRecall?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  objectCount?: Maybe<Scalars['Int']['output']>;
};

export type AnnotationOrderByClause = {
  annotationMethod?: InputMaybe<OrderBy>;
  annotationPublication?: InputMaybe<OrderBy>;
  annotationSoftware?: InputMaybe<OrderBy>;
  confidencePrecision?: InputMaybe<OrderBy>;
  confidenceRecall?: InputMaybe<OrderBy>;
  deposition?: InputMaybe<DepositionOrderByClause>;
  depositionDate?: InputMaybe<OrderBy>;
  groundTruthStatus?: InputMaybe<OrderBy>;
  groundTruthUsed?: InputMaybe<OrderBy>;
  httpsMetadataPath?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isCuratorRecommended?: InputMaybe<OrderBy>;
  lastModifiedDate?: InputMaybe<OrderBy>;
  methodType?: InputMaybe<OrderBy>;
  objectCount?: InputMaybe<OrderBy>;
  objectDescription?: InputMaybe<OrderBy>;
  objectId?: InputMaybe<OrderBy>;
  objectName?: InputMaybe<OrderBy>;
  objectState?: InputMaybe<OrderBy>;
  releaseDate?: InputMaybe<OrderBy>;
  run?: InputMaybe<RunOrderByClause>;
  s3MetadataPath?: InputMaybe<OrderBy>;
};

/** Shapes associated with an annotation */
export type AnnotationShape = EntityInterface & Node & {
  __typename?: 'AnnotationShape';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  annotation?: Maybe<Annotation>;
  annotationFiles: AnnotationFileConnection;
  annotationFilesAggregate?: Maybe<AnnotationFileAggregate>;
  annotationId?: Maybe<Scalars['Int']['output']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  shapeType?: Maybe<Annotation_File_Shape_Type_Enum>;
};


/** Shapes associated with an annotation */
export type AnnotationShapeAnnotationArgs = {
  orderBy?: InputMaybe<Array<AnnotationOrderByClause>>;
  where?: InputMaybe<AnnotationWhereClause>;
};


/** Shapes associated with an annotation */
export type AnnotationShapeAnnotationFilesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AnnotationFileOrderByClause>>;
  where?: InputMaybe<AnnotationFileWhereClause>;
};


/** Shapes associated with an annotation */
export type AnnotationShapeAnnotationFilesAggregateArgs = {
  where?: InputMaybe<AnnotationFileWhereClause>;
};

export type AnnotationShapeAggregate = {
  __typename?: 'AnnotationShapeAggregate';
  aggregate?: Maybe<Array<AnnotationShapeAggregateFunctions>>;
};

export type AnnotationShapeAggregateFunctions = {
  __typename?: 'AnnotationShapeAggregateFunctions';
  avg?: Maybe<AnnotationShapeNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<AnnotationShapeGroupByOptions>;
  max?: Maybe<AnnotationShapeMinMaxColumns>;
  min?: Maybe<AnnotationShapeMinMaxColumns>;
  stddev?: Maybe<AnnotationShapeNumericalColumns>;
  sum?: Maybe<AnnotationShapeNumericalColumns>;
  variance?: Maybe<AnnotationShapeNumericalColumns>;
};


export type AnnotationShapeAggregateFunctionsCountArgs = {
  columns?: InputMaybe<AnnotationShapeCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type AnnotationShapeConnection = {
  __typename?: 'AnnotationShapeConnection';
  /** Contains the nodes in this connection */
  edges: Array<AnnotationShapeEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum AnnotationShapeCountColumns {
  Annotation = 'annotation',
  AnnotationFiles = 'annotationFiles',
  Id = 'id',
  ShapeType = 'shapeType'
}

export type AnnotationShapeCreateInput = {
  /** Metadata about an annotation for a run */
  annotationId?: InputMaybe<Scalars['ID']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  shapeType?: InputMaybe<Annotation_File_Shape_Type_Enum>;
};

/** An edge in a connection. */
export type AnnotationShapeEdge = {
  __typename?: 'AnnotationShapeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: AnnotationShape;
};

export type AnnotationShapeGroupByOptions = {
  __typename?: 'AnnotationShapeGroupByOptions';
  annotation?: Maybe<AnnotationGroupByOptions>;
  id?: Maybe<Scalars['Int']['output']>;
  shapeType?: Maybe<Annotation_File_Shape_Type_Enum>;
};

export type AnnotationShapeMinMaxColumns = {
  __typename?: 'AnnotationShapeMinMaxColumns';
  id?: Maybe<Scalars['Int']['output']>;
};

export type AnnotationShapeNumericalColumns = {
  __typename?: 'AnnotationShapeNumericalColumns';
  id?: Maybe<Scalars['Int']['output']>;
};

export type AnnotationShapeOrderByClause = {
  annotation?: InputMaybe<AnnotationOrderByClause>;
  id?: InputMaybe<OrderBy>;
  shapeType?: InputMaybe<OrderBy>;
};

export type AnnotationShapeUpdateInput = {
  /** Metadata about an annotation for a run */
  annotationId?: InputMaybe<Scalars['ID']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  shapeType?: InputMaybe<Annotation_File_Shape_Type_Enum>;
};

export type AnnotationShapeWhereClause = {
  annotation?: InputMaybe<AnnotationWhereClause>;
  annotationFiles?: InputMaybe<AnnotationFileWhereClause>;
  id?: InputMaybe<IntComparators>;
  shapeType?: InputMaybe<Annotation_File_Shape_Type_EnumEnumComparators>;
};

export type AnnotationShapeWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type AnnotationUpdateInput = {
  /** Describe how the annotation is made (e.g. Manual, crYoLO, Positive Unlabeled Learning, template matching) */
  annotationMethod?: InputMaybe<Scalars['String']['input']>;
  /** List of publication IDs (EMPIAR, EMDB, DOI) that describe this annotation method. Comma separated. */
  annotationPublication?: InputMaybe<Scalars['String']['input']>;
  /** Software used for generating this annotation */
  annotationSoftware?: InputMaybe<Scalars['String']['input']>;
  /** Describe the confidence level of the annotation. Precision is defined as the % of annotation objects being true positive */
  confidencePrecision?: InputMaybe<Scalars['Float']['input']>;
  /** Describe the confidence level of the annotation. Recall is defined as the % of true positives being annotated correctly */
  confidenceRecall?: InputMaybe<Scalars['Float']['input']>;
  /** The date a data item was received by the cryoET data portal. */
  depositionDate?: InputMaybe<Scalars['DateTime']['input']>;
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** Whether an annotation is considered ground truth, as determined by the annotator. */
  groundTruthStatus?: InputMaybe<Scalars['Boolean']['input']>;
  /** Annotation filename used as ground truth for precision and recall */
  groundTruthUsed?: InputMaybe<Scalars['String']['input']>;
  /** Path to the file as an https url */
  httpsMetadataPath?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** This annotation is recommended by the curator to be preferred for this object type. */
  isCuratorRecommended?: InputMaybe<Scalars['Boolean']['input']>;
  /** The date a piece of data was last modified on the cryoET data portal. */
  lastModifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Classification of the annotation method based on supervision. */
  methodType?: InputMaybe<Annotation_Method_Type_Enum>;
  /** Number of objects identified */
  objectCount?: InputMaybe<Scalars['Int']['input']>;
  /** A textual description of the annotation object, can be a longer description to include additional information not covered by the Annotation object name and state. */
  objectDescription?: InputMaybe<Scalars['String']['input']>;
  /** Gene Ontology Cellular Component identifier for the annotation object */
  objectId?: InputMaybe<Scalars['String']['input']>;
  /** Name of the object being annotated (e.g. ribosome, nuclear pore complex, actin filament, membrane) */
  objectName?: InputMaybe<Scalars['String']['input']>;
  /** Molecule state annotated (e.g. open, closed) */
  objectState?: InputMaybe<Scalars['String']['input']>;
  /** The date a data item was received by the cryoET data portal. */
  releaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  runId?: InputMaybe<Scalars['ID']['input']>;
  /** Path to the file in s3 */
  s3MetadataPath?: InputMaybe<Scalars['String']['input']>;
};

export type AnnotationWhereClause = {
  annotationMethod?: InputMaybe<StrComparators>;
  annotationPublication?: InputMaybe<StrComparators>;
  annotationShapes?: InputMaybe<AnnotationShapeWhereClause>;
  annotationSoftware?: InputMaybe<StrComparators>;
  authors?: InputMaybe<AnnotationAuthorWhereClause>;
  confidencePrecision?: InputMaybe<FloatComparators>;
  confidenceRecall?: InputMaybe<FloatComparators>;
  deposition?: InputMaybe<DepositionWhereClause>;
  depositionDate?: InputMaybe<DatetimeComparators>;
  groundTruthStatus?: InputMaybe<BoolComparators>;
  groundTruthUsed?: InputMaybe<StrComparators>;
  httpsMetadataPath?: InputMaybe<StrComparators>;
  id?: InputMaybe<IntComparators>;
  isCuratorRecommended?: InputMaybe<BoolComparators>;
  lastModifiedDate?: InputMaybe<DatetimeComparators>;
  methodType?: InputMaybe<Annotation_Method_Type_EnumEnumComparators>;
  objectCount?: InputMaybe<IntComparators>;
  objectDescription?: InputMaybe<StrComparators>;
  objectId?: InputMaybe<StrComparators>;
  objectName?: InputMaybe<StrComparators>;
  objectState?: InputMaybe<StrComparators>;
  releaseDate?: InputMaybe<DatetimeComparators>;
  run?: InputMaybe<RunWhereClause>;
  s3MetadataPath?: InputMaybe<StrComparators>;
};

export type AnnotationWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type Annotation_File_Shape_Type_EnumEnumComparators = {
  _eq?: InputMaybe<Annotation_File_Shape_Type_Enum>;
  _gt?: InputMaybe<Annotation_File_Shape_Type_Enum>;
  _gte?: InputMaybe<Annotation_File_Shape_Type_Enum>;
  _in?: InputMaybe<Array<Annotation_File_Shape_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Annotation_File_Shape_Type_Enum>;
  _lte?: InputMaybe<Annotation_File_Shape_Type_Enum>;
  _neq?: InputMaybe<Annotation_File_Shape_Type_Enum>;
  _nin?: InputMaybe<Array<Annotation_File_Shape_Type_Enum>>;
};

export type Annotation_File_Source_EnumEnumComparators = {
  _eq?: InputMaybe<Annotation_File_Source_Enum>;
  _gt?: InputMaybe<Annotation_File_Source_Enum>;
  _gte?: InputMaybe<Annotation_File_Source_Enum>;
  _in?: InputMaybe<Array<Annotation_File_Source_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Annotation_File_Source_Enum>;
  _lte?: InputMaybe<Annotation_File_Source_Enum>;
  _neq?: InputMaybe<Annotation_File_Source_Enum>;
  _nin?: InputMaybe<Array<Annotation_File_Source_Enum>>;
};

export type Annotation_Method_Type_EnumEnumComparators = {
  _eq?: InputMaybe<Annotation_Method_Type_Enum>;
  _gt?: InputMaybe<Annotation_Method_Type_Enum>;
  _gte?: InputMaybe<Annotation_Method_Type_Enum>;
  _in?: InputMaybe<Array<Annotation_Method_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Annotation_Method_Type_Enum>;
  _lte?: InputMaybe<Annotation_Method_Type_Enum>;
  _neq?: InputMaybe<Annotation_Method_Type_Enum>;
  _nin?: InputMaybe<Array<Annotation_Method_Type_Enum>>;
};

export type BoolComparators = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** An author of a dataset */
export type Dataset = EntityInterface & Node & {
  __typename?: 'Dataset';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  authors: DatasetAuthorConnection;
  authorsAggregate?: Maybe<DatasetAuthorAggregate>;
  /** The GO identifier for the cellular component. */
  cellComponentId?: Maybe<Scalars['String']['output']>;
  /** Name of the cellular component. */
  cellComponentName?: Maybe<Scalars['String']['output']>;
  /** Name of the cell type from which a biological sample used in a CryoET study is derived from. */
  cellName?: Maybe<Scalars['String']['output']>;
  /** Link to more information about the cell strain. */
  cellStrainId?: Maybe<Scalars['String']['output']>;
  /** Cell line or strain for the sample. */
  cellStrainName?: Maybe<Scalars['String']['output']>;
  /** Cell Ontology identifier for the cell type */
  cellTypeId?: Maybe<Scalars['String']['output']>;
  deposition?: Maybe<Deposition>;
  /** The date a data item was received by the cryoET data portal. */
  depositionDate: Scalars['DateTime']['output'];
  depositionId?: Maybe<Scalars['Int']['output']>;
  /** A short description of a CryoET dataset, similar to an abstract for a journal article or dataset. */
  description: Scalars['String']['output'];
  fundingSources: DatasetFundingConnection;
  fundingSourcesAggregate?: Maybe<DatasetFundingAggregate>;
  /** Describes Cryo-ET grid preparation. */
  gridPreparation?: Maybe<Scalars['String']['output']>;
  /** Path to a directory containing data for this entity as an HTTPS url */
  httpsPrefix: Scalars['String']['output'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** URL for the thumbnail of preview image. */
  keyPhotoThumbnailUrl?: Maybe<Scalars['String']['output']>;
  /** URL for the dataset preview image. */
  keyPhotoUrl?: Maybe<Scalars['String']['output']>;
  /** The date a piece of data was last modified on the cryoET data portal. */
  lastModifiedDate: Scalars['DateTime']['output'];
  /** Name of the organism from which a biological sample used in a CryoET study is derived from, e.g. homo sapiens. */
  organismName: Scalars['String']['output'];
  /** NCBI taxonomy identifier for the organism, e.g. 9606 */
  organismTaxid?: Maybe<Scalars['Int']['output']>;
  /** Describes other setup not covered by sample preparation or grid preparation that may make this dataset unique in the same publication. */
  otherSetup?: Maybe<Scalars['String']['output']>;
  /** Comma-separated list of DOIs for publications associated with the dataset. */
  publications?: Maybe<Scalars['String']['output']>;
  /** Comma-separated list of related database entries for the dataset. */
  relatedDatabaseEntries?: Maybe<Scalars['String']['output']>;
  /** The date a data item was received by the cryoET data portal. */
  releaseDate: Scalars['DateTime']['output'];
  runs: RunConnection;
  runsAggregate?: Maybe<RunAggregate>;
  /** Path to a directory containing data for this entity as an S3 url */
  s3Prefix: Scalars['String']['output'];
  /** Describes how the sample was prepared. */
  samplePreparation?: Maybe<Scalars['String']['output']>;
  /** Type of sample imaged in a CryoET study */
  sampleType?: Maybe<Sample_Type_Enum>;
  /** The UBERON identifier for the tissue. */
  tissueId?: Maybe<Scalars['String']['output']>;
  /** Name of the tissue from which a biological sample used in a CryoET study is derived from. */
  tissueName?: Maybe<Scalars['String']['output']>;
  /** Title of a CryoET dataset. */
  title: Scalars['String']['output'];
};


/** An author of a dataset */
export type DatasetAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DatasetAuthorOrderByClause>>;
  where?: InputMaybe<DatasetAuthorWhereClause>;
};


/** An author of a dataset */
export type DatasetAuthorsAggregateArgs = {
  where?: InputMaybe<DatasetAuthorWhereClause>;
};


/** An author of a dataset */
export type DatasetDepositionArgs = {
  orderBy?: InputMaybe<Array<DepositionOrderByClause>>;
  where?: InputMaybe<DepositionWhereClause>;
};


/** An author of a dataset */
export type DatasetFundingSourcesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DatasetFundingOrderByClause>>;
  where?: InputMaybe<DatasetFundingWhereClause>;
};


/** An author of a dataset */
export type DatasetFundingSourcesAggregateArgs = {
  where?: InputMaybe<DatasetFundingWhereClause>;
};


/** An author of a dataset */
export type DatasetRunsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RunOrderByClause>>;
  where?: InputMaybe<RunWhereClause>;
};


/** An author of a dataset */
export type DatasetRunsAggregateArgs = {
  where?: InputMaybe<RunWhereClause>;
};

export type DatasetAggregate = {
  __typename?: 'DatasetAggregate';
  aggregate?: Maybe<Array<DatasetAggregateFunctions>>;
};

export type DatasetAggregateFunctions = {
  __typename?: 'DatasetAggregateFunctions';
  avg?: Maybe<DatasetNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<DatasetGroupByOptions>;
  max?: Maybe<DatasetMinMaxColumns>;
  min?: Maybe<DatasetMinMaxColumns>;
  stddev?: Maybe<DatasetNumericalColumns>;
  sum?: Maybe<DatasetNumericalColumns>;
  variance?: Maybe<DatasetNumericalColumns>;
};


export type DatasetAggregateFunctionsCountArgs = {
  columns?: InputMaybe<DatasetCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An author of a dataset */
export type DatasetAuthor = EntityInterface & Node & {
  __typename?: 'DatasetAuthor';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  /** The address of the author's affiliation. */
  affiliationAddress?: Maybe<Scalars['String']['output']>;
  /** A Research Organization Registry (ROR) identifier. */
  affiliationIdentifier?: Maybe<Scalars['String']['output']>;
  /** The name of the author's affiliation. */
  affiliationName?: Maybe<Scalars['String']['output']>;
  /** The order that the author is listed as in the associated publication */
  authorListOrder: Scalars['Int']['output'];
  /** Whether the author is a corresponding author. */
  correspondingAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
  dataset?: Maybe<Dataset>;
  datasetId?: Maybe<Scalars['Int']['output']>;
  /** The email address of the author. */
  email?: Maybe<Scalars['String']['output']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** The full name of the author. */
  name: Scalars['String']['output'];
  /** The ORCID identifier for the author. */
  orcid?: Maybe<Scalars['String']['output']>;
  /** Whether the author is a primary author. */
  primaryAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
};


/** An author of a dataset */
export type DatasetAuthorDatasetArgs = {
  orderBy?: InputMaybe<Array<DatasetOrderByClause>>;
  where?: InputMaybe<DatasetWhereClause>;
};

export type DatasetAuthorAggregate = {
  __typename?: 'DatasetAuthorAggregate';
  aggregate?: Maybe<Array<DatasetAuthorAggregateFunctions>>;
};

export type DatasetAuthorAggregateFunctions = {
  __typename?: 'DatasetAuthorAggregateFunctions';
  avg?: Maybe<DatasetAuthorNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<DatasetAuthorGroupByOptions>;
  max?: Maybe<DatasetAuthorMinMaxColumns>;
  min?: Maybe<DatasetAuthorMinMaxColumns>;
  stddev?: Maybe<DatasetAuthorNumericalColumns>;
  sum?: Maybe<DatasetAuthorNumericalColumns>;
  variance?: Maybe<DatasetAuthorNumericalColumns>;
};


export type DatasetAuthorAggregateFunctionsCountArgs = {
  columns?: InputMaybe<DatasetAuthorCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type DatasetAuthorConnection = {
  __typename?: 'DatasetAuthorConnection';
  /** Contains the nodes in this connection */
  edges: Array<DatasetAuthorEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum DatasetAuthorCountColumns {
  AffiliationAddress = 'affiliationAddress',
  AffiliationIdentifier = 'affiliationIdentifier',
  AffiliationName = 'affiliationName',
  AuthorListOrder = 'authorListOrder',
  CorrespondingAuthorStatus = 'correspondingAuthorStatus',
  Dataset = 'dataset',
  Email = 'email',
  Id = 'id',
  Name = 'name',
  Orcid = 'orcid',
  PrimaryAuthorStatus = 'primaryAuthorStatus'
}

export type DatasetAuthorCreateInput = {
  /** The address of the author's affiliation. */
  affiliationAddress?: InputMaybe<Scalars['String']['input']>;
  /** A Research Organization Registry (ROR) identifier. */
  affiliationIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the author's affiliation. */
  affiliationName?: InputMaybe<Scalars['String']['input']>;
  /** The order that the author is listed as in the associated publication */
  authorListOrder: Scalars['Int']['input'];
  /** Whether the author is a corresponding author. */
  correspondingAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
  /** An author of a dataset */
  datasetId?: InputMaybe<Scalars['ID']['input']>;
  /** The email address of the author. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** The full name of the author. */
  name: Scalars['String']['input'];
  /** The ORCID identifier for the author. */
  orcid?: InputMaybe<Scalars['String']['input']>;
  /** Whether the author is a primary author. */
  primaryAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An edge in a connection. */
export type DatasetAuthorEdge = {
  __typename?: 'DatasetAuthorEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: DatasetAuthor;
};

export type DatasetAuthorGroupByOptions = {
  __typename?: 'DatasetAuthorGroupByOptions';
  affiliationAddress?: Maybe<Scalars['String']['output']>;
  affiliationIdentifier?: Maybe<Scalars['String']['output']>;
  affiliationName?: Maybe<Scalars['String']['output']>;
  authorListOrder?: Maybe<Scalars['Int']['output']>;
  correspondingAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
  dataset?: Maybe<DatasetGroupByOptions>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  orcid?: Maybe<Scalars['String']['output']>;
  primaryAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
};

export type DatasetAuthorMinMaxColumns = {
  __typename?: 'DatasetAuthorMinMaxColumns';
  affiliationAddress?: Maybe<Scalars['String']['output']>;
  affiliationIdentifier?: Maybe<Scalars['String']['output']>;
  affiliationName?: Maybe<Scalars['String']['output']>;
  authorListOrder?: Maybe<Scalars['Int']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  orcid?: Maybe<Scalars['String']['output']>;
};

export type DatasetAuthorNumericalColumns = {
  __typename?: 'DatasetAuthorNumericalColumns';
  authorListOrder?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type DatasetAuthorOrderByClause = {
  affiliationAddress?: InputMaybe<OrderBy>;
  affiliationIdentifier?: InputMaybe<OrderBy>;
  affiliationName?: InputMaybe<OrderBy>;
  authorListOrder?: InputMaybe<OrderBy>;
  correspondingAuthorStatus?: InputMaybe<OrderBy>;
  dataset?: InputMaybe<DatasetOrderByClause>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  orcid?: InputMaybe<OrderBy>;
  primaryAuthorStatus?: InputMaybe<OrderBy>;
};

export type DatasetAuthorUpdateInput = {
  /** The address of the author's affiliation. */
  affiliationAddress?: InputMaybe<Scalars['String']['input']>;
  /** A Research Organization Registry (ROR) identifier. */
  affiliationIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the author's affiliation. */
  affiliationName?: InputMaybe<Scalars['String']['input']>;
  /** The order that the author is listed as in the associated publication */
  authorListOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Whether the author is a corresponding author. */
  correspondingAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
  /** An author of a dataset */
  datasetId?: InputMaybe<Scalars['ID']['input']>;
  /** The email address of the author. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** The full name of the author. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The ORCID identifier for the author. */
  orcid?: InputMaybe<Scalars['String']['input']>;
  /** Whether the author is a primary author. */
  primaryAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DatasetAuthorWhereClause = {
  affiliationAddress?: InputMaybe<StrComparators>;
  affiliationIdentifier?: InputMaybe<StrComparators>;
  affiliationName?: InputMaybe<StrComparators>;
  authorListOrder?: InputMaybe<IntComparators>;
  correspondingAuthorStatus?: InputMaybe<BoolComparators>;
  dataset?: InputMaybe<DatasetWhereClause>;
  email?: InputMaybe<StrComparators>;
  id?: InputMaybe<IntComparators>;
  name?: InputMaybe<StrComparators>;
  orcid?: InputMaybe<StrComparators>;
  primaryAuthorStatus?: InputMaybe<BoolComparators>;
};

export type DatasetAuthorWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

/** A connection to a list of items. */
export type DatasetConnection = {
  __typename?: 'DatasetConnection';
  /** Contains the nodes in this connection */
  edges: Array<DatasetEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum DatasetCountColumns {
  Authors = 'authors',
  CellComponentId = 'cellComponentId',
  CellComponentName = 'cellComponentName',
  CellName = 'cellName',
  CellStrainId = 'cellStrainId',
  CellStrainName = 'cellStrainName',
  CellTypeId = 'cellTypeId',
  Deposition = 'deposition',
  DepositionDate = 'depositionDate',
  Description = 'description',
  FundingSources = 'fundingSources',
  GridPreparation = 'gridPreparation',
  HttpsPrefix = 'httpsPrefix',
  Id = 'id',
  KeyPhotoThumbnailUrl = 'keyPhotoThumbnailUrl',
  KeyPhotoUrl = 'keyPhotoUrl',
  LastModifiedDate = 'lastModifiedDate',
  OrganismName = 'organismName',
  OrganismTaxid = 'organismTaxid',
  OtherSetup = 'otherSetup',
  Publications = 'publications',
  RelatedDatabaseEntries = 'relatedDatabaseEntries',
  ReleaseDate = 'releaseDate',
  Runs = 'runs',
  S3Prefix = 's3Prefix',
  SamplePreparation = 'samplePreparation',
  SampleType = 'sampleType',
  TissueId = 'tissueId',
  TissueName = 'tissueName',
  Title = 'title'
}

export type DatasetCreateInput = {
  /** The GO identifier for the cellular component. */
  cellComponentId?: InputMaybe<Scalars['String']['input']>;
  /** Name of the cellular component. */
  cellComponentName?: InputMaybe<Scalars['String']['input']>;
  /** Name of the cell type from which a biological sample used in a CryoET study is derived from. */
  cellName?: InputMaybe<Scalars['String']['input']>;
  /** Link to more information about the cell strain. */
  cellStrainId?: InputMaybe<Scalars['String']['input']>;
  /** Cell line or strain for the sample. */
  cellStrainName?: InputMaybe<Scalars['String']['input']>;
  /** Cell Ontology identifier for the cell type */
  cellTypeId?: InputMaybe<Scalars['String']['input']>;
  /** The date a data item was received by the cryoET data portal. */
  depositionDate: Scalars['DateTime']['input'];
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** A short description of a CryoET dataset, similar to an abstract for a journal article or dataset. */
  description: Scalars['String']['input'];
  /** Describes Cryo-ET grid preparation. */
  gridPreparation?: InputMaybe<Scalars['String']['input']>;
  /** Path to a directory containing data for this entity as an HTTPS url */
  httpsPrefix: Scalars['String']['input'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** URL for the thumbnail of preview image. */
  keyPhotoThumbnailUrl?: InputMaybe<Scalars['String']['input']>;
  /** URL for the dataset preview image. */
  keyPhotoUrl?: InputMaybe<Scalars['String']['input']>;
  /** The date a piece of data was last modified on the cryoET data portal. */
  lastModifiedDate: Scalars['DateTime']['input'];
  /** Name of the organism from which a biological sample used in a CryoET study is derived from, e.g. homo sapiens. */
  organismName: Scalars['String']['input'];
  /** NCBI taxonomy identifier for the organism, e.g. 9606 */
  organismTaxid?: InputMaybe<Scalars['Int']['input']>;
  /** Describes other setup not covered by sample preparation or grid preparation that may make this dataset unique in the same publication. */
  otherSetup?: InputMaybe<Scalars['String']['input']>;
  /** Comma-separated list of DOIs for publications associated with the dataset. */
  publications?: InputMaybe<Scalars['String']['input']>;
  /** Comma-separated list of related database entries for the dataset. */
  relatedDatabaseEntries?: InputMaybe<Scalars['String']['input']>;
  /** The date a data item was received by the cryoET data portal. */
  releaseDate: Scalars['DateTime']['input'];
  /** Path to a directory containing data for this entity as an S3 url */
  s3Prefix: Scalars['String']['input'];
  /** Describes how the sample was prepared. */
  samplePreparation?: InputMaybe<Scalars['String']['input']>;
  /** Type of sample imaged in a CryoET study */
  sampleType?: InputMaybe<Sample_Type_Enum>;
  /** The UBERON identifier for the tissue. */
  tissueId?: InputMaybe<Scalars['String']['input']>;
  /** Name of the tissue from which a biological sample used in a CryoET study is derived from. */
  tissueName?: InputMaybe<Scalars['String']['input']>;
  /** Title of a CryoET dataset. */
  title: Scalars['String']['input'];
};

/** An edge in a connection. */
export type DatasetEdge = {
  __typename?: 'DatasetEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Dataset;
};

/** Information about how a dataset was funded */
export type DatasetFunding = EntityInterface & Node & {
  __typename?: 'DatasetFunding';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  dataset?: Maybe<Dataset>;
  datasetId?: Maybe<Scalars['Int']['output']>;
  /** The name of the funding source. */
  fundingAgencyName?: Maybe<Scalars['String']['output']>;
  /** Grant identifier provided by the funding agency */
  grantId?: Maybe<Scalars['String']['output']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
};


/** Information about how a dataset was funded */
export type DatasetFundingDatasetArgs = {
  orderBy?: InputMaybe<Array<DatasetOrderByClause>>;
  where?: InputMaybe<DatasetWhereClause>;
};

export type DatasetFundingAggregate = {
  __typename?: 'DatasetFundingAggregate';
  aggregate?: Maybe<Array<DatasetFundingAggregateFunctions>>;
};

export type DatasetFundingAggregateFunctions = {
  __typename?: 'DatasetFundingAggregateFunctions';
  avg?: Maybe<DatasetFundingNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<DatasetFundingGroupByOptions>;
  max?: Maybe<DatasetFundingMinMaxColumns>;
  min?: Maybe<DatasetFundingMinMaxColumns>;
  stddev?: Maybe<DatasetFundingNumericalColumns>;
  sum?: Maybe<DatasetFundingNumericalColumns>;
  variance?: Maybe<DatasetFundingNumericalColumns>;
};


export type DatasetFundingAggregateFunctionsCountArgs = {
  columns?: InputMaybe<DatasetFundingCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type DatasetFundingConnection = {
  __typename?: 'DatasetFundingConnection';
  /** Contains the nodes in this connection */
  edges: Array<DatasetFundingEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum DatasetFundingCountColumns {
  Dataset = 'dataset',
  FundingAgencyName = 'fundingAgencyName',
  GrantId = 'grantId',
  Id = 'id'
}

export type DatasetFundingCreateInput = {
  /** An author of a dataset */
  datasetId?: InputMaybe<Scalars['ID']['input']>;
  /** The name of the funding source. */
  fundingAgencyName?: InputMaybe<Scalars['String']['input']>;
  /** Grant identifier provided by the funding agency */
  grantId?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
};

/** An edge in a connection. */
export type DatasetFundingEdge = {
  __typename?: 'DatasetFundingEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: DatasetFunding;
};

export type DatasetFundingGroupByOptions = {
  __typename?: 'DatasetFundingGroupByOptions';
  dataset?: Maybe<DatasetGroupByOptions>;
  fundingAgencyName?: Maybe<Scalars['String']['output']>;
  grantId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type DatasetFundingMinMaxColumns = {
  __typename?: 'DatasetFundingMinMaxColumns';
  fundingAgencyName?: Maybe<Scalars['String']['output']>;
  grantId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type DatasetFundingNumericalColumns = {
  __typename?: 'DatasetFundingNumericalColumns';
  id?: Maybe<Scalars['Int']['output']>;
};

export type DatasetFundingOrderByClause = {
  dataset?: InputMaybe<DatasetOrderByClause>;
  fundingAgencyName?: InputMaybe<OrderBy>;
  grantId?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

export type DatasetFundingUpdateInput = {
  /** An author of a dataset */
  datasetId?: InputMaybe<Scalars['ID']['input']>;
  /** The name of the funding source. */
  fundingAgencyName?: InputMaybe<Scalars['String']['input']>;
  /** Grant identifier provided by the funding agency */
  grantId?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type DatasetFundingWhereClause = {
  dataset?: InputMaybe<DatasetWhereClause>;
  fundingAgencyName?: InputMaybe<StrComparators>;
  grantId?: InputMaybe<StrComparators>;
  id?: InputMaybe<IntComparators>;
};

export type DatasetFundingWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type DatasetGroupByOptions = {
  __typename?: 'DatasetGroupByOptions';
  cellComponentId?: Maybe<Scalars['String']['output']>;
  cellComponentName?: Maybe<Scalars['String']['output']>;
  cellName?: Maybe<Scalars['String']['output']>;
  cellStrainId?: Maybe<Scalars['String']['output']>;
  cellStrainName?: Maybe<Scalars['String']['output']>;
  cellTypeId?: Maybe<Scalars['String']['output']>;
  deposition?: Maybe<DepositionGroupByOptions>;
  depositionDate?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  gridPreparation?: Maybe<Scalars['String']['output']>;
  httpsPrefix?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  keyPhotoThumbnailUrl?: Maybe<Scalars['String']['output']>;
  keyPhotoUrl?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['DateTime']['output']>;
  organismName?: Maybe<Scalars['String']['output']>;
  organismTaxid?: Maybe<Scalars['Int']['output']>;
  otherSetup?: Maybe<Scalars['String']['output']>;
  publications?: Maybe<Scalars['String']['output']>;
  relatedDatabaseEntries?: Maybe<Scalars['String']['output']>;
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
  s3Prefix?: Maybe<Scalars['String']['output']>;
  samplePreparation?: Maybe<Scalars['String']['output']>;
  sampleType?: Maybe<Sample_Type_Enum>;
  tissueId?: Maybe<Scalars['String']['output']>;
  tissueName?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type DatasetMinMaxColumns = {
  __typename?: 'DatasetMinMaxColumns';
  cellComponentId?: Maybe<Scalars['String']['output']>;
  cellComponentName?: Maybe<Scalars['String']['output']>;
  cellName?: Maybe<Scalars['String']['output']>;
  cellStrainId?: Maybe<Scalars['String']['output']>;
  cellStrainName?: Maybe<Scalars['String']['output']>;
  cellTypeId?: Maybe<Scalars['String']['output']>;
  depositionDate?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  gridPreparation?: Maybe<Scalars['String']['output']>;
  httpsPrefix?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  keyPhotoThumbnailUrl?: Maybe<Scalars['String']['output']>;
  keyPhotoUrl?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['DateTime']['output']>;
  organismName?: Maybe<Scalars['String']['output']>;
  organismTaxid?: Maybe<Scalars['Int']['output']>;
  otherSetup?: Maybe<Scalars['String']['output']>;
  publications?: Maybe<Scalars['String']['output']>;
  relatedDatabaseEntries?: Maybe<Scalars['String']['output']>;
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
  s3Prefix?: Maybe<Scalars['String']['output']>;
  samplePreparation?: Maybe<Scalars['String']['output']>;
  tissueId?: Maybe<Scalars['String']['output']>;
  tissueName?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type DatasetNumericalColumns = {
  __typename?: 'DatasetNumericalColumns';
  id?: Maybe<Scalars['Int']['output']>;
  organismTaxid?: Maybe<Scalars['Int']['output']>;
};

export type DatasetOrderByClause = {
  cellComponentId?: InputMaybe<OrderBy>;
  cellComponentName?: InputMaybe<OrderBy>;
  cellName?: InputMaybe<OrderBy>;
  cellStrainId?: InputMaybe<OrderBy>;
  cellStrainName?: InputMaybe<OrderBy>;
  cellTypeId?: InputMaybe<OrderBy>;
  deposition?: InputMaybe<DepositionOrderByClause>;
  depositionDate?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  gridPreparation?: InputMaybe<OrderBy>;
  httpsPrefix?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  keyPhotoThumbnailUrl?: InputMaybe<OrderBy>;
  keyPhotoUrl?: InputMaybe<OrderBy>;
  lastModifiedDate?: InputMaybe<OrderBy>;
  organismName?: InputMaybe<OrderBy>;
  organismTaxid?: InputMaybe<OrderBy>;
  otherSetup?: InputMaybe<OrderBy>;
  publications?: InputMaybe<OrderBy>;
  relatedDatabaseEntries?: InputMaybe<OrderBy>;
  releaseDate?: InputMaybe<OrderBy>;
  s3Prefix?: InputMaybe<OrderBy>;
  samplePreparation?: InputMaybe<OrderBy>;
  sampleType?: InputMaybe<OrderBy>;
  tissueId?: InputMaybe<OrderBy>;
  tissueName?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
};

export type DatasetUpdateInput = {
  /** The GO identifier for the cellular component. */
  cellComponentId?: InputMaybe<Scalars['String']['input']>;
  /** Name of the cellular component. */
  cellComponentName?: InputMaybe<Scalars['String']['input']>;
  /** Name of the cell type from which a biological sample used in a CryoET study is derived from. */
  cellName?: InputMaybe<Scalars['String']['input']>;
  /** Link to more information about the cell strain. */
  cellStrainId?: InputMaybe<Scalars['String']['input']>;
  /** Cell line or strain for the sample. */
  cellStrainName?: InputMaybe<Scalars['String']['input']>;
  /** Cell Ontology identifier for the cell type */
  cellTypeId?: InputMaybe<Scalars['String']['input']>;
  /** The date a data item was received by the cryoET data portal. */
  depositionDate?: InputMaybe<Scalars['DateTime']['input']>;
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** A short description of a CryoET dataset, similar to an abstract for a journal article or dataset. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Describes Cryo-ET grid preparation. */
  gridPreparation?: InputMaybe<Scalars['String']['input']>;
  /** Path to a directory containing data for this entity as an HTTPS url */
  httpsPrefix?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** URL for the thumbnail of preview image. */
  keyPhotoThumbnailUrl?: InputMaybe<Scalars['String']['input']>;
  /** URL for the dataset preview image. */
  keyPhotoUrl?: InputMaybe<Scalars['String']['input']>;
  /** The date a piece of data was last modified on the cryoET data portal. */
  lastModifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Name of the organism from which a biological sample used in a CryoET study is derived from, e.g. homo sapiens. */
  organismName?: InputMaybe<Scalars['String']['input']>;
  /** NCBI taxonomy identifier for the organism, e.g. 9606 */
  organismTaxid?: InputMaybe<Scalars['Int']['input']>;
  /** Describes other setup not covered by sample preparation or grid preparation that may make this dataset unique in the same publication. */
  otherSetup?: InputMaybe<Scalars['String']['input']>;
  /** Comma-separated list of DOIs for publications associated with the dataset. */
  publications?: InputMaybe<Scalars['String']['input']>;
  /** Comma-separated list of related database entries for the dataset. */
  relatedDatabaseEntries?: InputMaybe<Scalars['String']['input']>;
  /** The date a data item was received by the cryoET data portal. */
  releaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Path to a directory containing data for this entity as an S3 url */
  s3Prefix?: InputMaybe<Scalars['String']['input']>;
  /** Describes how the sample was prepared. */
  samplePreparation?: InputMaybe<Scalars['String']['input']>;
  /** Type of sample imaged in a CryoET study */
  sampleType?: InputMaybe<Sample_Type_Enum>;
  /** The UBERON identifier for the tissue. */
  tissueId?: InputMaybe<Scalars['String']['input']>;
  /** Name of the tissue from which a biological sample used in a CryoET study is derived from. */
  tissueName?: InputMaybe<Scalars['String']['input']>;
  /** Title of a CryoET dataset. */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type DatasetWhereClause = {
  authors?: InputMaybe<DatasetAuthorWhereClause>;
  cellComponentId?: InputMaybe<StrComparators>;
  cellComponentName?: InputMaybe<StrComparators>;
  cellName?: InputMaybe<StrComparators>;
  cellStrainId?: InputMaybe<StrComparators>;
  cellStrainName?: InputMaybe<StrComparators>;
  cellTypeId?: InputMaybe<StrComparators>;
  deposition?: InputMaybe<DepositionWhereClause>;
  depositionDate?: InputMaybe<DatetimeComparators>;
  description?: InputMaybe<StrComparators>;
  fundingSources?: InputMaybe<DatasetFundingWhereClause>;
  gridPreparation?: InputMaybe<StrComparators>;
  httpsPrefix?: InputMaybe<StrComparators>;
  id?: InputMaybe<IntComparators>;
  keyPhotoThumbnailUrl?: InputMaybe<StrComparators>;
  keyPhotoUrl?: InputMaybe<StrComparators>;
  lastModifiedDate?: InputMaybe<DatetimeComparators>;
  organismName?: InputMaybe<StrComparators>;
  organismTaxid?: InputMaybe<IntComparators>;
  otherSetup?: InputMaybe<StrComparators>;
  publications?: InputMaybe<StrComparators>;
  relatedDatabaseEntries?: InputMaybe<StrComparators>;
  releaseDate?: InputMaybe<DatetimeComparators>;
  runs?: InputMaybe<RunWhereClause>;
  s3Prefix?: InputMaybe<StrComparators>;
  samplePreparation?: InputMaybe<StrComparators>;
  sampleType?: InputMaybe<Sample_Type_EnumEnumComparators>;
  tissueId?: InputMaybe<StrComparators>;
  tissueName?: InputMaybe<StrComparators>;
  title?: InputMaybe<StrComparators>;
};

export type DatasetWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type DatetimeComparators = {
  _eq?: InputMaybe<Scalars['DateTime']['input']>;
  _gt?: InputMaybe<Scalars['DateTime']['input']>;
  _gte?: InputMaybe<Scalars['DateTime']['input']>;
  _in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['DateTime']['input']>;
  _lte?: InputMaybe<Scalars['DateTime']['input']>;
  _neq?: InputMaybe<Scalars['DateTime']['input']>;
  _nin?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type Deposition = EntityInterface & Node & {
  __typename?: 'Deposition';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  alignments: AlignmentConnection;
  alignmentsAggregate?: Maybe<AlignmentAggregate>;
  annotations: AnnotationConnection;
  annotationsAggregate?: Maybe<AnnotationAggregate>;
  authors: DepositionAuthorConnection;
  authorsAggregate?: Maybe<DepositionAuthorAggregate>;
  datasets: DatasetConnection;
  datasetsAggregate?: Maybe<DatasetAggregate>;
  /** The date a data item was received by the cryoET data portal. */
  depositionDate: Scalars['DateTime']['output'];
  /** A short description of the deposition, similar to an abstract for a journal article or dataset. */
  depositionDescription: Scalars['String']['output'];
  /** Title of a CryoET deposition. */
  depositionTitle: Scalars['String']['output'];
  depositionTypes: DepositionTypeConnection;
  depositionTypesAggregate?: Maybe<DepositionTypeAggregate>;
  frames: FrameConnection;
  framesAggregate?: Maybe<FrameAggregate>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** The date a piece of data was last modified on the cryoET data portal. */
  lastModifiedDate: Scalars['DateTime']['output'];
  /** Comma-separated list of DOIs for publications associated with the dataset. */
  publications?: Maybe<Scalars['String']['output']>;
  /** Comma-separated list of related database entries for the dataset. */
  relatedDatabaseEntries?: Maybe<Scalars['String']['output']>;
  /** The date a data item was received by the cryoET data portal. */
  releaseDate: Scalars['DateTime']['output'];
  tiltseries: TiltseriesConnection;
  tiltseriesAggregate?: Maybe<TiltseriesAggregate>;
  tomograms: TomogramConnection;
  tomogramsAggregate?: Maybe<TomogramAggregate>;
};


export type DepositionAlignmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AlignmentOrderByClause>>;
  where?: InputMaybe<AlignmentWhereClause>;
};


export type DepositionAlignmentsAggregateArgs = {
  where?: InputMaybe<AlignmentWhereClause>;
};


export type DepositionAnnotationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AnnotationOrderByClause>>;
  where?: InputMaybe<AnnotationWhereClause>;
};


export type DepositionAnnotationsAggregateArgs = {
  where?: InputMaybe<AnnotationWhereClause>;
};


export type DepositionAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DepositionAuthorOrderByClause>>;
  where?: InputMaybe<DepositionAuthorWhereClause>;
};


export type DepositionAuthorsAggregateArgs = {
  where?: InputMaybe<DepositionAuthorWhereClause>;
};


export type DepositionDatasetsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DatasetOrderByClause>>;
  where?: InputMaybe<DatasetWhereClause>;
};


export type DepositionDatasetsAggregateArgs = {
  where?: InputMaybe<DatasetWhereClause>;
};


export type DepositionDepositionTypesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DepositionTypeOrderByClause>>;
  where?: InputMaybe<DepositionTypeWhereClause>;
};


export type DepositionDepositionTypesAggregateArgs = {
  where?: InputMaybe<DepositionTypeWhereClause>;
};


export type DepositionFramesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FrameOrderByClause>>;
  where?: InputMaybe<FrameWhereClause>;
};


export type DepositionFramesAggregateArgs = {
  where?: InputMaybe<FrameWhereClause>;
};


export type DepositionTiltseriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TiltseriesOrderByClause>>;
  where?: InputMaybe<TiltseriesWhereClause>;
};


export type DepositionTiltseriesAggregateArgs = {
  where?: InputMaybe<TiltseriesWhereClause>;
};


export type DepositionTomogramsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TomogramOrderByClause>>;
  where?: InputMaybe<TomogramWhereClause>;
};


export type DepositionTomogramsAggregateArgs = {
  where?: InputMaybe<TomogramWhereClause>;
};

export type DepositionAggregate = {
  __typename?: 'DepositionAggregate';
  aggregate?: Maybe<Array<DepositionAggregateFunctions>>;
};

export type DepositionAggregateFunctions = {
  __typename?: 'DepositionAggregateFunctions';
  avg?: Maybe<DepositionNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<DepositionGroupByOptions>;
  max?: Maybe<DepositionMinMaxColumns>;
  min?: Maybe<DepositionMinMaxColumns>;
  stddev?: Maybe<DepositionNumericalColumns>;
  sum?: Maybe<DepositionNumericalColumns>;
  variance?: Maybe<DepositionNumericalColumns>;
};


export type DepositionAggregateFunctionsCountArgs = {
  columns?: InputMaybe<DepositionCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Author of a deposition */
export type DepositionAuthor = EntityInterface & Node & {
  __typename?: 'DepositionAuthor';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  /** The address of the author's affiliation. */
  affiliationAddress?: Maybe<Scalars['String']['output']>;
  /** A Research Organization Registry (ROR) identifier. */
  affiliationIdentifier?: Maybe<Scalars['String']['output']>;
  /** The name of the author's affiliation. */
  affiliationName?: Maybe<Scalars['String']['output']>;
  /** The order that the author is listed as in the associated publication */
  authorListOrder: Scalars['Int']['output'];
  /** Whether the author is a corresponding author. */
  correspondingAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
  deposition?: Maybe<Deposition>;
  depositionId?: Maybe<Scalars['Int']['output']>;
  /** The email address of the author. */
  email?: Maybe<Scalars['String']['output']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** The full name of the author. */
  name: Scalars['String']['output'];
  /** The ORCID identifier for the author. */
  orcid?: Maybe<Scalars['String']['output']>;
  /** Whether the author is a primary author. */
  primaryAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
};


/** Author of a deposition */
export type DepositionAuthorDepositionArgs = {
  orderBy?: InputMaybe<Array<DepositionOrderByClause>>;
  where?: InputMaybe<DepositionWhereClause>;
};

export type DepositionAuthorAggregate = {
  __typename?: 'DepositionAuthorAggregate';
  aggregate?: Maybe<Array<DepositionAuthorAggregateFunctions>>;
};

export type DepositionAuthorAggregateFunctions = {
  __typename?: 'DepositionAuthorAggregateFunctions';
  avg?: Maybe<DepositionAuthorNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<DepositionAuthorGroupByOptions>;
  max?: Maybe<DepositionAuthorMinMaxColumns>;
  min?: Maybe<DepositionAuthorMinMaxColumns>;
  stddev?: Maybe<DepositionAuthorNumericalColumns>;
  sum?: Maybe<DepositionAuthorNumericalColumns>;
  variance?: Maybe<DepositionAuthorNumericalColumns>;
};


export type DepositionAuthorAggregateFunctionsCountArgs = {
  columns?: InputMaybe<DepositionAuthorCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type DepositionAuthorConnection = {
  __typename?: 'DepositionAuthorConnection';
  /** Contains the nodes in this connection */
  edges: Array<DepositionAuthorEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum DepositionAuthorCountColumns {
  AffiliationAddress = 'affiliationAddress',
  AffiliationIdentifier = 'affiliationIdentifier',
  AffiliationName = 'affiliationName',
  AuthorListOrder = 'authorListOrder',
  CorrespondingAuthorStatus = 'correspondingAuthorStatus',
  Deposition = 'deposition',
  Email = 'email',
  Id = 'id',
  Name = 'name',
  Orcid = 'orcid',
  PrimaryAuthorStatus = 'primaryAuthorStatus'
}

export type DepositionAuthorCreateInput = {
  /** The address of the author's affiliation. */
  affiliationAddress?: InputMaybe<Scalars['String']['input']>;
  /** A Research Organization Registry (ROR) identifier. */
  affiliationIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the author's affiliation. */
  affiliationName?: InputMaybe<Scalars['String']['input']>;
  /** The order that the author is listed as in the associated publication */
  authorListOrder: Scalars['Int']['input'];
  /** Whether the author is a corresponding author. */
  correspondingAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** The email address of the author. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** The full name of the author. */
  name: Scalars['String']['input'];
  /** The ORCID identifier for the author. */
  orcid?: InputMaybe<Scalars['String']['input']>;
  /** Whether the author is a primary author. */
  primaryAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An edge in a connection. */
export type DepositionAuthorEdge = {
  __typename?: 'DepositionAuthorEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: DepositionAuthor;
};

export type DepositionAuthorGroupByOptions = {
  __typename?: 'DepositionAuthorGroupByOptions';
  affiliationAddress?: Maybe<Scalars['String']['output']>;
  affiliationIdentifier?: Maybe<Scalars['String']['output']>;
  affiliationName?: Maybe<Scalars['String']['output']>;
  authorListOrder?: Maybe<Scalars['Int']['output']>;
  correspondingAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
  deposition?: Maybe<DepositionGroupByOptions>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  orcid?: Maybe<Scalars['String']['output']>;
  primaryAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
};

export type DepositionAuthorMinMaxColumns = {
  __typename?: 'DepositionAuthorMinMaxColumns';
  affiliationAddress?: Maybe<Scalars['String']['output']>;
  affiliationIdentifier?: Maybe<Scalars['String']['output']>;
  affiliationName?: Maybe<Scalars['String']['output']>;
  authorListOrder?: Maybe<Scalars['Int']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  orcid?: Maybe<Scalars['String']['output']>;
};

export type DepositionAuthorNumericalColumns = {
  __typename?: 'DepositionAuthorNumericalColumns';
  authorListOrder?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type DepositionAuthorOrderByClause = {
  affiliationAddress?: InputMaybe<OrderBy>;
  affiliationIdentifier?: InputMaybe<OrderBy>;
  affiliationName?: InputMaybe<OrderBy>;
  authorListOrder?: InputMaybe<OrderBy>;
  correspondingAuthorStatus?: InputMaybe<OrderBy>;
  deposition?: InputMaybe<DepositionOrderByClause>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  orcid?: InputMaybe<OrderBy>;
  primaryAuthorStatus?: InputMaybe<OrderBy>;
};

export type DepositionAuthorUpdateInput = {
  /** The address of the author's affiliation. */
  affiliationAddress?: InputMaybe<Scalars['String']['input']>;
  /** A Research Organization Registry (ROR) identifier. */
  affiliationIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the author's affiliation. */
  affiliationName?: InputMaybe<Scalars['String']['input']>;
  /** The order that the author is listed as in the associated publication */
  authorListOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Whether the author is a corresponding author. */
  correspondingAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** The email address of the author. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** The full name of the author. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The ORCID identifier for the author. */
  orcid?: InputMaybe<Scalars['String']['input']>;
  /** Whether the author is a primary author. */
  primaryAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DepositionAuthorWhereClause = {
  affiliationAddress?: InputMaybe<StrComparators>;
  affiliationIdentifier?: InputMaybe<StrComparators>;
  affiliationName?: InputMaybe<StrComparators>;
  authorListOrder?: InputMaybe<IntComparators>;
  correspondingAuthorStatus?: InputMaybe<BoolComparators>;
  deposition?: InputMaybe<DepositionWhereClause>;
  email?: InputMaybe<StrComparators>;
  id?: InputMaybe<IntComparators>;
  name?: InputMaybe<StrComparators>;
  orcid?: InputMaybe<StrComparators>;
  primaryAuthorStatus?: InputMaybe<BoolComparators>;
};

export type DepositionAuthorWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export enum DepositionCountColumns {
  Alignments = 'alignments',
  Annotations = 'annotations',
  Authors = 'authors',
  Datasets = 'datasets',
  DepositionDate = 'depositionDate',
  DepositionDescription = 'depositionDescription',
  DepositionTitle = 'depositionTitle',
  DepositionTypes = 'depositionTypes',
  Frames = 'frames',
  Id = 'id',
  LastModifiedDate = 'lastModifiedDate',
  Publications = 'publications',
  RelatedDatabaseEntries = 'relatedDatabaseEntries',
  ReleaseDate = 'releaseDate',
  Tiltseries = 'tiltseries',
  Tomograms = 'tomograms'
}

export type DepositionCreateInput = {
  /** The date a data item was received by the cryoET data portal. */
  depositionDate: Scalars['DateTime']['input'];
  /** A short description of the deposition, similar to an abstract for a journal article or dataset. */
  depositionDescription: Scalars['String']['input'];
  /** Title of a CryoET deposition. */
  depositionTitle: Scalars['String']['input'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** The date a piece of data was last modified on the cryoET data portal. */
  lastModifiedDate: Scalars['DateTime']['input'];
  /** Comma-separated list of DOIs for publications associated with the dataset. */
  publications?: InputMaybe<Scalars['String']['input']>;
  /** Comma-separated list of related database entries for the dataset. */
  relatedDatabaseEntries?: InputMaybe<Scalars['String']['input']>;
  /** The date a data item was received by the cryoET data portal. */
  releaseDate: Scalars['DateTime']['input'];
};

export type DepositionGroupByOptions = {
  __typename?: 'DepositionGroupByOptions';
  depositionDate?: Maybe<Scalars['DateTime']['output']>;
  depositionDescription?: Maybe<Scalars['String']['output']>;
  depositionTitle?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  lastModifiedDate?: Maybe<Scalars['DateTime']['output']>;
  publications?: Maybe<Scalars['String']['output']>;
  relatedDatabaseEntries?: Maybe<Scalars['String']['output']>;
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
};

export type DepositionMinMaxColumns = {
  __typename?: 'DepositionMinMaxColumns';
  depositionDate?: Maybe<Scalars['DateTime']['output']>;
  depositionDescription?: Maybe<Scalars['String']['output']>;
  depositionTitle?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  lastModifiedDate?: Maybe<Scalars['DateTime']['output']>;
  publications?: Maybe<Scalars['String']['output']>;
  relatedDatabaseEntries?: Maybe<Scalars['String']['output']>;
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
};

export type DepositionNumericalColumns = {
  __typename?: 'DepositionNumericalColumns';
  id?: Maybe<Scalars['Int']['output']>;
};

export type DepositionOrderByClause = {
  depositionDate?: InputMaybe<OrderBy>;
  depositionDescription?: InputMaybe<OrderBy>;
  depositionTitle?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  lastModifiedDate?: InputMaybe<OrderBy>;
  publications?: InputMaybe<OrderBy>;
  relatedDatabaseEntries?: InputMaybe<OrderBy>;
  releaseDate?: InputMaybe<OrderBy>;
};

export type DepositionType = EntityInterface & Node & {
  __typename?: 'DepositionType';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  deposition?: Maybe<Deposition>;
  depositionId?: Maybe<Scalars['Int']['output']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  type?: Maybe<Deposition_Types_Enum>;
};


export type DepositionTypeDepositionArgs = {
  orderBy?: InputMaybe<Array<DepositionOrderByClause>>;
  where?: InputMaybe<DepositionWhereClause>;
};

export type DepositionTypeAggregate = {
  __typename?: 'DepositionTypeAggregate';
  aggregate?: Maybe<Array<DepositionTypeAggregateFunctions>>;
};

export type DepositionTypeAggregateFunctions = {
  __typename?: 'DepositionTypeAggregateFunctions';
  avg?: Maybe<DepositionTypeNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<DepositionTypeGroupByOptions>;
  max?: Maybe<DepositionTypeMinMaxColumns>;
  min?: Maybe<DepositionTypeMinMaxColumns>;
  stddev?: Maybe<DepositionTypeNumericalColumns>;
  sum?: Maybe<DepositionTypeNumericalColumns>;
  variance?: Maybe<DepositionTypeNumericalColumns>;
};


export type DepositionTypeAggregateFunctionsCountArgs = {
  columns?: InputMaybe<DepositionTypeCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type DepositionTypeConnection = {
  __typename?: 'DepositionTypeConnection';
  /** Contains the nodes in this connection */
  edges: Array<DepositionTypeEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum DepositionTypeCountColumns {
  Deposition = 'deposition',
  Id = 'id',
  Type = 'type'
}

export type DepositionTypeCreateInput = {
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  type?: InputMaybe<Deposition_Types_Enum>;
};

/** An edge in a connection. */
export type DepositionTypeEdge = {
  __typename?: 'DepositionTypeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: DepositionType;
};

export type DepositionTypeGroupByOptions = {
  __typename?: 'DepositionTypeGroupByOptions';
  deposition?: Maybe<DepositionGroupByOptions>;
  id?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Deposition_Types_Enum>;
};

export type DepositionTypeMinMaxColumns = {
  __typename?: 'DepositionTypeMinMaxColumns';
  id?: Maybe<Scalars['Int']['output']>;
};

export type DepositionTypeNumericalColumns = {
  __typename?: 'DepositionTypeNumericalColumns';
  id?: Maybe<Scalars['Int']['output']>;
};

export type DepositionTypeOrderByClause = {
  deposition?: InputMaybe<DepositionOrderByClause>;
  id?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
};

export type DepositionTypeUpdateInput = {
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Deposition_Types_Enum>;
};

export type DepositionTypeWhereClause = {
  deposition?: InputMaybe<DepositionWhereClause>;
  id?: InputMaybe<IntComparators>;
  type?: InputMaybe<Deposition_Types_EnumEnumComparators>;
};

export type DepositionTypeWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type DepositionUpdateInput = {
  /** The date a data item was received by the cryoET data portal. */
  depositionDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** A short description of the deposition, similar to an abstract for a journal article or dataset. */
  depositionDescription?: InputMaybe<Scalars['String']['input']>;
  /** Title of a CryoET deposition. */
  depositionTitle?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** The date a piece of data was last modified on the cryoET data portal. */
  lastModifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Comma-separated list of DOIs for publications associated with the dataset. */
  publications?: InputMaybe<Scalars['String']['input']>;
  /** Comma-separated list of related database entries for the dataset. */
  relatedDatabaseEntries?: InputMaybe<Scalars['String']['input']>;
  /** The date a data item was received by the cryoET data portal. */
  releaseDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DepositionWhereClause = {
  alignments?: InputMaybe<AlignmentWhereClause>;
  annotations?: InputMaybe<AnnotationWhereClause>;
  authors?: InputMaybe<DepositionAuthorWhereClause>;
  datasets?: InputMaybe<DatasetWhereClause>;
  depositionDate?: InputMaybe<DatetimeComparators>;
  depositionDescription?: InputMaybe<StrComparators>;
  depositionTitle?: InputMaybe<StrComparators>;
  depositionTypes?: InputMaybe<DepositionTypeWhereClause>;
  frames?: InputMaybe<FrameWhereClause>;
  id?: InputMaybe<IntComparators>;
  lastModifiedDate?: InputMaybe<DatetimeComparators>;
  publications?: InputMaybe<StrComparators>;
  relatedDatabaseEntries?: InputMaybe<StrComparators>;
  releaseDate?: InputMaybe<DatetimeComparators>;
  tiltseries?: InputMaybe<TiltseriesWhereClause>;
  tomograms?: InputMaybe<TomogramWhereClause>;
};

export type DepositionWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type Deposition_Types_EnumEnumComparators = {
  _eq?: InputMaybe<Deposition_Types_Enum>;
  _gt?: InputMaybe<Deposition_Types_Enum>;
  _gte?: InputMaybe<Deposition_Types_Enum>;
  _in?: InputMaybe<Array<Deposition_Types_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Deposition_Types_Enum>;
  _lte?: InputMaybe<Deposition_Types_Enum>;
  _neq?: InputMaybe<Deposition_Types_Enum>;
  _nin?: InputMaybe<Array<Deposition_Types_Enum>>;
};

export type EntityInterface = {
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
};

export type Fiducial_Alignment_Status_EnumEnumComparators = {
  _eq?: InputMaybe<Fiducial_Alignment_Status_Enum>;
  _gt?: InputMaybe<Fiducial_Alignment_Status_Enum>;
  _gte?: InputMaybe<Fiducial_Alignment_Status_Enum>;
  _in?: InputMaybe<Array<Fiducial_Alignment_Status_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Fiducial_Alignment_Status_Enum>;
  _lte?: InputMaybe<Fiducial_Alignment_Status_Enum>;
  _neq?: InputMaybe<Fiducial_Alignment_Status_Enum>;
  _nin?: InputMaybe<Array<Fiducial_Alignment_Status_Enum>>;
};

export type FloatComparators = {
  _eq?: InputMaybe<Scalars['Float']['input']>;
  _gt?: InputMaybe<Scalars['Float']['input']>;
  _gte?: InputMaybe<Scalars['Float']['input']>;
  _in?: InputMaybe<Array<Scalars['Float']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Float']['input']>;
  _lte?: InputMaybe<Scalars['Float']['input']>;
  _neq?: InputMaybe<Scalars['Float']['input']>;
  _nin?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type Frame = EntityInterface & Node & {
  __typename?: 'Frame';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  /** Frame's acquistion order within a tilt experiment */
  acquisitionOrder?: Maybe<Scalars['Int']['output']>;
  deposition?: Maybe<Deposition>;
  depositionId?: Maybe<Scalars['Int']['output']>;
  /** The raw camera angle for a frame */
  dose: Scalars['Float']['output'];
  /** HTTPS path to the gain file for this frame */
  httpsGainFile?: Maybe<Scalars['String']['output']>;
  /** Path to a directory containing data for this entity as an HTTPS url */
  httpsPrefix: Scalars['String']['output'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** Whether this frame has been gain corrected */
  isGainCorrected?: Maybe<Scalars['Boolean']['output']>;
  perSectionParameters: PerSectionParametersConnection;
  perSectionParametersAggregate?: Maybe<PerSectionParametersAggregate>;
  /** Camera angle for a frame */
  rawAngle: Scalars['Float']['output'];
  run?: Maybe<Run>;
  runId?: Maybe<Scalars['Int']['output']>;
  /** S3 path to the gain file for this frame */
  s3GainFile?: Maybe<Scalars['String']['output']>;
  /** Path to a directory containing data for this entity as an S3 url */
  s3Prefix: Scalars['String']['output'];
};


export type FrameDepositionArgs = {
  orderBy?: InputMaybe<Array<DepositionOrderByClause>>;
  where?: InputMaybe<DepositionWhereClause>;
};


export type FramePerSectionParametersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PerSectionParametersOrderByClause>>;
  where?: InputMaybe<PerSectionParametersWhereClause>;
};


export type FramePerSectionParametersAggregateArgs = {
  where?: InputMaybe<PerSectionParametersWhereClause>;
};


export type FrameRunArgs = {
  orderBy?: InputMaybe<Array<RunOrderByClause>>;
  where?: InputMaybe<RunWhereClause>;
};

export type FrameAggregate = {
  __typename?: 'FrameAggregate';
  aggregate?: Maybe<Array<FrameAggregateFunctions>>;
};

export type FrameAggregateFunctions = {
  __typename?: 'FrameAggregateFunctions';
  avg?: Maybe<FrameNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<FrameGroupByOptions>;
  max?: Maybe<FrameMinMaxColumns>;
  min?: Maybe<FrameMinMaxColumns>;
  stddev?: Maybe<FrameNumericalColumns>;
  sum?: Maybe<FrameNumericalColumns>;
  variance?: Maybe<FrameNumericalColumns>;
};


export type FrameAggregateFunctionsCountArgs = {
  columns?: InputMaybe<FrameCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type FrameConnection = {
  __typename?: 'FrameConnection';
  /** Contains the nodes in this connection */
  edges: Array<FrameEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum FrameCountColumns {
  AcquisitionOrder = 'acquisitionOrder',
  Deposition = 'deposition',
  Dose = 'dose',
  HttpsGainFile = 'httpsGainFile',
  HttpsPrefix = 'httpsPrefix',
  Id = 'id',
  IsGainCorrected = 'isGainCorrected',
  PerSectionParameters = 'perSectionParameters',
  RawAngle = 'rawAngle',
  Run = 'run',
  S3GainFile = 's3GainFile',
  S3Prefix = 's3Prefix'
}

export type FrameCreateInput = {
  /** Frame's acquistion order within a tilt experiment */
  acquisitionOrder?: InputMaybe<Scalars['Int']['input']>;
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** The raw camera angle for a frame */
  dose: Scalars['Float']['input'];
  /** HTTPS path to the gain file for this frame */
  httpsGainFile?: InputMaybe<Scalars['String']['input']>;
  /** Path to a directory containing data for this entity as an HTTPS url */
  httpsPrefix: Scalars['String']['input'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** Whether this frame has been gain corrected */
  isGainCorrected?: InputMaybe<Scalars['Boolean']['input']>;
  /** Camera angle for a frame */
  rawAngle: Scalars['Float']['input'];
  runId?: InputMaybe<Scalars['ID']['input']>;
  /** S3 path to the gain file for this frame */
  s3GainFile?: InputMaybe<Scalars['String']['input']>;
  /** Path to a directory containing data for this entity as an S3 url */
  s3Prefix: Scalars['String']['input'];
};

/** An edge in a connection. */
export type FrameEdge = {
  __typename?: 'FrameEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Frame;
};

export type FrameGroupByOptions = {
  __typename?: 'FrameGroupByOptions';
  acquisitionOrder?: Maybe<Scalars['Int']['output']>;
  deposition?: Maybe<DepositionGroupByOptions>;
  dose?: Maybe<Scalars['Float']['output']>;
  httpsGainFile?: Maybe<Scalars['String']['output']>;
  httpsPrefix?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  isGainCorrected?: Maybe<Scalars['Boolean']['output']>;
  rawAngle?: Maybe<Scalars['Float']['output']>;
  run?: Maybe<RunGroupByOptions>;
  s3GainFile?: Maybe<Scalars['String']['output']>;
  s3Prefix?: Maybe<Scalars['String']['output']>;
};

export type FrameMinMaxColumns = {
  __typename?: 'FrameMinMaxColumns';
  acquisitionOrder?: Maybe<Scalars['Int']['output']>;
  dose?: Maybe<Scalars['Float']['output']>;
  httpsGainFile?: Maybe<Scalars['String']['output']>;
  httpsPrefix?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  rawAngle?: Maybe<Scalars['Float']['output']>;
  s3GainFile?: Maybe<Scalars['String']['output']>;
  s3Prefix?: Maybe<Scalars['String']['output']>;
};

export type FrameNumericalColumns = {
  __typename?: 'FrameNumericalColumns';
  acquisitionOrder?: Maybe<Scalars['Int']['output']>;
  dose?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  rawAngle?: Maybe<Scalars['Float']['output']>;
};

export type FrameOrderByClause = {
  acquisitionOrder?: InputMaybe<OrderBy>;
  deposition?: InputMaybe<DepositionOrderByClause>;
  dose?: InputMaybe<OrderBy>;
  httpsGainFile?: InputMaybe<OrderBy>;
  httpsPrefix?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isGainCorrected?: InputMaybe<OrderBy>;
  rawAngle?: InputMaybe<OrderBy>;
  run?: InputMaybe<RunOrderByClause>;
  s3GainFile?: InputMaybe<OrderBy>;
  s3Prefix?: InputMaybe<OrderBy>;
};

export type FrameUpdateInput = {
  /** Frame's acquistion order within a tilt experiment */
  acquisitionOrder?: InputMaybe<Scalars['Int']['input']>;
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** The raw camera angle for a frame */
  dose?: InputMaybe<Scalars['Float']['input']>;
  /** HTTPS path to the gain file for this frame */
  httpsGainFile?: InputMaybe<Scalars['String']['input']>;
  /** Path to a directory containing data for this entity as an HTTPS url */
  httpsPrefix?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Whether this frame has been gain corrected */
  isGainCorrected?: InputMaybe<Scalars['Boolean']['input']>;
  /** Camera angle for a frame */
  rawAngle?: InputMaybe<Scalars['Float']['input']>;
  runId?: InputMaybe<Scalars['ID']['input']>;
  /** S3 path to the gain file for this frame */
  s3GainFile?: InputMaybe<Scalars['String']['input']>;
  /** Path to a directory containing data for this entity as an S3 url */
  s3Prefix?: InputMaybe<Scalars['String']['input']>;
};

export type FrameWhereClause = {
  acquisitionOrder?: InputMaybe<IntComparators>;
  deposition?: InputMaybe<DepositionWhereClause>;
  dose?: InputMaybe<FloatComparators>;
  httpsGainFile?: InputMaybe<StrComparators>;
  httpsPrefix?: InputMaybe<StrComparators>;
  id?: InputMaybe<IntComparators>;
  isGainCorrected?: InputMaybe<BoolComparators>;
  perSectionParameters?: InputMaybe<PerSectionParametersWhereClause>;
  rawAngle?: InputMaybe<FloatComparators>;
  run?: InputMaybe<RunWhereClause>;
  s3GainFile?: InputMaybe<StrComparators>;
  s3Prefix?: InputMaybe<StrComparators>;
};

export type FrameWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type IntComparators = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type LimitOffsetClause = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAlignment: Alignment;
  createAnnotation: Annotation;
  createAnnotationAuthor: AnnotationAuthor;
  createAnnotationFile: AnnotationFile;
  createAnnotationShape: AnnotationShape;
  createDataset: Dataset;
  createDatasetAuthor: DatasetAuthor;
  createDatasetFunding: DatasetFunding;
  createDeposition: Deposition;
  createDepositionAuthor: DepositionAuthor;
  createDepositionType: DepositionType;
  createFrame: Frame;
  createPerSectionAlignmentParameters: PerSectionAlignmentParameters;
  createPerSectionParameters: PerSectionParameters;
  createRun: Run;
  createTiltseries: Tiltseries;
  createTomogram: Tomogram;
  createTomogramAuthor: TomogramAuthor;
  createTomogramVoxelSpacing: TomogramVoxelSpacing;
  deleteAlignment: Array<Alignment>;
  deleteAnnotation: Array<Annotation>;
  deleteAnnotationAuthor: Array<AnnotationAuthor>;
  deleteAnnotationFile: Array<AnnotationFile>;
  deleteAnnotationShape: Array<AnnotationShape>;
  deleteDataset: Array<Dataset>;
  deleteDatasetAuthor: Array<DatasetAuthor>;
  deleteDatasetFunding: Array<DatasetFunding>;
  deleteDeposition: Array<Deposition>;
  deleteDepositionAuthor: Array<DepositionAuthor>;
  deleteDepositionType: Array<DepositionType>;
  deleteFrame: Array<Frame>;
  deletePerSectionAlignmentParameters: Array<PerSectionAlignmentParameters>;
  deletePerSectionParameters: Array<PerSectionParameters>;
  deleteRun: Array<Run>;
  deleteTiltseries: Array<Tiltseries>;
  deleteTomogram: Array<Tomogram>;
  deleteTomogramAuthor: Array<TomogramAuthor>;
  deleteTomogramVoxelSpacing: Array<TomogramVoxelSpacing>;
  updateAlignment: Array<Alignment>;
  updateAnnotation: Array<Annotation>;
  updateAnnotationAuthor: Array<AnnotationAuthor>;
  updateAnnotationFile: Array<AnnotationFile>;
  updateAnnotationShape: Array<AnnotationShape>;
  updateDataset: Array<Dataset>;
  updateDatasetAuthor: Array<DatasetAuthor>;
  updateDatasetFunding: Array<DatasetFunding>;
  updateDeposition: Array<Deposition>;
  updateDepositionAuthor: Array<DepositionAuthor>;
  updateDepositionType: Array<DepositionType>;
  updateFrame: Array<Frame>;
  updatePerSectionAlignmentParameters: Array<PerSectionAlignmentParameters>;
  updatePerSectionParameters: Array<PerSectionParameters>;
  updateRun: Array<Run>;
  updateTiltseries: Array<Tiltseries>;
  updateTomogram: Array<Tomogram>;
  updateTomogramAuthor: Array<TomogramAuthor>;
  updateTomogramVoxelSpacing: Array<TomogramVoxelSpacing>;
};


export type MutationCreateAlignmentArgs = {
  input: AlignmentCreateInput;
};


export type MutationCreateAnnotationArgs = {
  input: AnnotationCreateInput;
};


export type MutationCreateAnnotationAuthorArgs = {
  input: AnnotationAuthorCreateInput;
};


export type MutationCreateAnnotationFileArgs = {
  input: AnnotationFileCreateInput;
};


export type MutationCreateAnnotationShapeArgs = {
  input: AnnotationShapeCreateInput;
};


export type MutationCreateDatasetArgs = {
  input: DatasetCreateInput;
};


export type MutationCreateDatasetAuthorArgs = {
  input: DatasetAuthorCreateInput;
};


export type MutationCreateDatasetFundingArgs = {
  input: DatasetFundingCreateInput;
};


export type MutationCreateDepositionArgs = {
  input: DepositionCreateInput;
};


export type MutationCreateDepositionAuthorArgs = {
  input: DepositionAuthorCreateInput;
};


export type MutationCreateDepositionTypeArgs = {
  input: DepositionTypeCreateInput;
};


export type MutationCreateFrameArgs = {
  input: FrameCreateInput;
};


export type MutationCreatePerSectionAlignmentParametersArgs = {
  input: PerSectionAlignmentParametersCreateInput;
};


export type MutationCreatePerSectionParametersArgs = {
  input: PerSectionParametersCreateInput;
};


export type MutationCreateRunArgs = {
  input: RunCreateInput;
};


export type MutationCreateTiltseriesArgs = {
  input: TiltseriesCreateInput;
};


export type MutationCreateTomogramArgs = {
  input: TomogramCreateInput;
};


export type MutationCreateTomogramAuthorArgs = {
  input: TomogramAuthorCreateInput;
};


export type MutationCreateTomogramVoxelSpacingArgs = {
  input: TomogramVoxelSpacingCreateInput;
};


export type MutationDeleteAlignmentArgs = {
  where: AlignmentWhereClauseMutations;
};


export type MutationDeleteAnnotationArgs = {
  where: AnnotationWhereClauseMutations;
};


export type MutationDeleteAnnotationAuthorArgs = {
  where: AnnotationAuthorWhereClauseMutations;
};


export type MutationDeleteAnnotationFileArgs = {
  where: AnnotationFileWhereClauseMutations;
};


export type MutationDeleteAnnotationShapeArgs = {
  where: AnnotationShapeWhereClauseMutations;
};


export type MutationDeleteDatasetArgs = {
  where: DatasetWhereClauseMutations;
};


export type MutationDeleteDatasetAuthorArgs = {
  where: DatasetAuthorWhereClauseMutations;
};


export type MutationDeleteDatasetFundingArgs = {
  where: DatasetFundingWhereClauseMutations;
};


export type MutationDeleteDepositionArgs = {
  where: DepositionWhereClauseMutations;
};


export type MutationDeleteDepositionAuthorArgs = {
  where: DepositionAuthorWhereClauseMutations;
};


export type MutationDeleteDepositionTypeArgs = {
  where: DepositionTypeWhereClauseMutations;
};


export type MutationDeleteFrameArgs = {
  where: FrameWhereClauseMutations;
};


export type MutationDeletePerSectionAlignmentParametersArgs = {
  where: PerSectionAlignmentParametersWhereClauseMutations;
};


export type MutationDeletePerSectionParametersArgs = {
  where: PerSectionParametersWhereClauseMutations;
};


export type MutationDeleteRunArgs = {
  where: RunWhereClauseMutations;
};


export type MutationDeleteTiltseriesArgs = {
  where: TiltseriesWhereClauseMutations;
};


export type MutationDeleteTomogramArgs = {
  where: TomogramWhereClauseMutations;
};


export type MutationDeleteTomogramAuthorArgs = {
  where: TomogramAuthorWhereClauseMutations;
};


export type MutationDeleteTomogramVoxelSpacingArgs = {
  where: TomogramVoxelSpacingWhereClauseMutations;
};


export type MutationUpdateAlignmentArgs = {
  input: AlignmentUpdateInput;
  where: AlignmentWhereClauseMutations;
};


export type MutationUpdateAnnotationArgs = {
  input: AnnotationUpdateInput;
  where: AnnotationWhereClauseMutations;
};


export type MutationUpdateAnnotationAuthorArgs = {
  input: AnnotationAuthorUpdateInput;
  where: AnnotationAuthorWhereClauseMutations;
};


export type MutationUpdateAnnotationFileArgs = {
  input: AnnotationFileUpdateInput;
  where: AnnotationFileWhereClauseMutations;
};


export type MutationUpdateAnnotationShapeArgs = {
  input: AnnotationShapeUpdateInput;
  where: AnnotationShapeWhereClauseMutations;
};


export type MutationUpdateDatasetArgs = {
  input: DatasetUpdateInput;
  where: DatasetWhereClauseMutations;
};


export type MutationUpdateDatasetAuthorArgs = {
  input: DatasetAuthorUpdateInput;
  where: DatasetAuthorWhereClauseMutations;
};


export type MutationUpdateDatasetFundingArgs = {
  input: DatasetFundingUpdateInput;
  where: DatasetFundingWhereClauseMutations;
};


export type MutationUpdateDepositionArgs = {
  input: DepositionUpdateInput;
  where: DepositionWhereClauseMutations;
};


export type MutationUpdateDepositionAuthorArgs = {
  input: DepositionAuthorUpdateInput;
  where: DepositionAuthorWhereClauseMutations;
};


export type MutationUpdateDepositionTypeArgs = {
  input: DepositionTypeUpdateInput;
  where: DepositionTypeWhereClauseMutations;
};


export type MutationUpdateFrameArgs = {
  input: FrameUpdateInput;
  where: FrameWhereClauseMutations;
};


export type MutationUpdatePerSectionAlignmentParametersArgs = {
  input: PerSectionAlignmentParametersUpdateInput;
  where: PerSectionAlignmentParametersWhereClauseMutations;
};


export type MutationUpdatePerSectionParametersArgs = {
  input: PerSectionParametersUpdateInput;
  where: PerSectionParametersWhereClauseMutations;
};


export type MutationUpdateRunArgs = {
  input: RunUpdateInput;
  where: RunWhereClauseMutations;
};


export type MutationUpdateTiltseriesArgs = {
  input: TiltseriesUpdateInput;
  where: TiltseriesWhereClauseMutations;
};


export type MutationUpdateTomogramArgs = {
  input: TomogramUpdateInput;
  where: TomogramWhereClauseMutations;
};


export type MutationUpdateTomogramAuthorArgs = {
  input: TomogramAuthorUpdateInput;
  where: TomogramAuthorWhereClauseMutations;
};


export type MutationUpdateTomogramVoxelSpacingArgs = {
  input: TomogramVoxelSpacingUpdateInput;
  where: TomogramVoxelSpacingWhereClauseMutations;
};

/** An object with a Globally Unique ID */
export type Node = {
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
};

/** Information to aid in pagination. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

/** Map alignment parameters to tilt series frames */
export type PerSectionAlignmentParameters = EntityInterface & Node & {
  __typename?: 'PerSectionAlignmentParameters';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  alignment?: Maybe<Alignment>;
  alignmentId: Scalars['Int']['output'];
  /** Beam tilt during projection in degrees */
  beamTilt?: Maybe<Scalars['Float']['output']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** In-plane rotation of the projection in degrees */
  inPlaneRotation?: Maybe<Scalars['Float']['output']>;
  /** Tilt angle of the projection in degrees */
  tiltAngle?: Maybe<Scalars['Float']['output']>;
  /** In-plane X-shift of the projection in angstrom */
  xOffset?: Maybe<Scalars['Float']['output']>;
  /** In-plane Y-shift of the projection in angstrom */
  yOffset?: Maybe<Scalars['Float']['output']>;
  /** z-index of the frame in the tiltseries */
  zIndex: Scalars['Int']['output'];
};


/** Map alignment parameters to tilt series frames */
export type PerSectionAlignmentParametersAlignmentArgs = {
  orderBy?: InputMaybe<Array<AlignmentOrderByClause>>;
  where?: InputMaybe<AlignmentWhereClause>;
};

export type PerSectionAlignmentParametersAggregate = {
  __typename?: 'PerSectionAlignmentParametersAggregate';
  aggregate?: Maybe<Array<PerSectionAlignmentParametersAggregateFunctions>>;
};

export type PerSectionAlignmentParametersAggregateFunctions = {
  __typename?: 'PerSectionAlignmentParametersAggregateFunctions';
  avg?: Maybe<PerSectionAlignmentParametersNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<PerSectionAlignmentParametersGroupByOptions>;
  max?: Maybe<PerSectionAlignmentParametersMinMaxColumns>;
  min?: Maybe<PerSectionAlignmentParametersMinMaxColumns>;
  stddev?: Maybe<PerSectionAlignmentParametersNumericalColumns>;
  sum?: Maybe<PerSectionAlignmentParametersNumericalColumns>;
  variance?: Maybe<PerSectionAlignmentParametersNumericalColumns>;
};


export type PerSectionAlignmentParametersAggregateFunctionsCountArgs = {
  columns?: InputMaybe<PerSectionAlignmentParametersCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type PerSectionAlignmentParametersConnection = {
  __typename?: 'PerSectionAlignmentParametersConnection';
  /** Contains the nodes in this connection */
  edges: Array<PerSectionAlignmentParametersEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum PerSectionAlignmentParametersCountColumns {
  Alignment = 'alignment',
  BeamTilt = 'beamTilt',
  Id = 'id',
  InPlaneRotation = 'inPlaneRotation',
  TiltAngle = 'tiltAngle',
  XOffset = 'xOffset',
  YOffset = 'yOffset',
  ZIndex = 'zIndex'
}

export type PerSectionAlignmentParametersCreateInput = {
  /** Tiltseries Alignment */
  alignmentId: Scalars['ID']['input'];
  /** Beam tilt during projection in degrees */
  beamTilt?: InputMaybe<Scalars['Float']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** In-plane rotation of the projection in degrees */
  inPlaneRotation?: InputMaybe<Scalars['Float']['input']>;
  /** Tilt angle of the projection in degrees */
  tiltAngle?: InputMaybe<Scalars['Float']['input']>;
  /** In-plane X-shift of the projection in angstrom */
  xOffset?: InputMaybe<Scalars['Float']['input']>;
  /** In-plane Y-shift of the projection in angstrom */
  yOffset?: InputMaybe<Scalars['Float']['input']>;
  /** z-index of the frame in the tiltseries */
  zIndex: Scalars['Int']['input'];
};

/** An edge in a connection. */
export type PerSectionAlignmentParametersEdge = {
  __typename?: 'PerSectionAlignmentParametersEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: PerSectionAlignmentParameters;
};

export type PerSectionAlignmentParametersGroupByOptions = {
  __typename?: 'PerSectionAlignmentParametersGroupByOptions';
  alignment?: Maybe<AlignmentGroupByOptions>;
  beamTilt?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  inPlaneRotation?: Maybe<Scalars['Float']['output']>;
  tiltAngle?: Maybe<Scalars['Float']['output']>;
  xOffset?: Maybe<Scalars['Float']['output']>;
  yOffset?: Maybe<Scalars['Float']['output']>;
  zIndex?: Maybe<Scalars['Int']['output']>;
};

export type PerSectionAlignmentParametersMinMaxColumns = {
  __typename?: 'PerSectionAlignmentParametersMinMaxColumns';
  beamTilt?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  inPlaneRotation?: Maybe<Scalars['Float']['output']>;
  tiltAngle?: Maybe<Scalars['Float']['output']>;
  xOffset?: Maybe<Scalars['Float']['output']>;
  yOffset?: Maybe<Scalars['Float']['output']>;
  zIndex?: Maybe<Scalars['Int']['output']>;
};

export type PerSectionAlignmentParametersNumericalColumns = {
  __typename?: 'PerSectionAlignmentParametersNumericalColumns';
  beamTilt?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  inPlaneRotation?: Maybe<Scalars['Float']['output']>;
  tiltAngle?: Maybe<Scalars['Float']['output']>;
  xOffset?: Maybe<Scalars['Float']['output']>;
  yOffset?: Maybe<Scalars['Float']['output']>;
  zIndex?: Maybe<Scalars['Int']['output']>;
};

export type PerSectionAlignmentParametersOrderByClause = {
  alignment?: InputMaybe<AlignmentOrderByClause>;
  beamTilt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  inPlaneRotation?: InputMaybe<OrderBy>;
  tiltAngle?: InputMaybe<OrderBy>;
  xOffset?: InputMaybe<OrderBy>;
  yOffset?: InputMaybe<OrderBy>;
  zIndex?: InputMaybe<OrderBy>;
};

export type PerSectionAlignmentParametersUpdateInput = {
  /** Tiltseries Alignment */
  alignmentId?: InputMaybe<Scalars['ID']['input']>;
  /** Beam tilt during projection in degrees */
  beamTilt?: InputMaybe<Scalars['Float']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** In-plane rotation of the projection in degrees */
  inPlaneRotation?: InputMaybe<Scalars['Float']['input']>;
  /** Tilt angle of the projection in degrees */
  tiltAngle?: InputMaybe<Scalars['Float']['input']>;
  /** In-plane X-shift of the projection in angstrom */
  xOffset?: InputMaybe<Scalars['Float']['input']>;
  /** In-plane Y-shift of the projection in angstrom */
  yOffset?: InputMaybe<Scalars['Float']['input']>;
  /** z-index of the frame in the tiltseries */
  zIndex?: InputMaybe<Scalars['Int']['input']>;
};

export type PerSectionAlignmentParametersWhereClause = {
  alignment?: InputMaybe<AlignmentWhereClause>;
  beamTilt?: InputMaybe<FloatComparators>;
  id?: InputMaybe<IntComparators>;
  inPlaneRotation?: InputMaybe<FloatComparators>;
  tiltAngle?: InputMaybe<FloatComparators>;
  xOffset?: InputMaybe<FloatComparators>;
  yOffset?: InputMaybe<FloatComparators>;
  zIndex?: InputMaybe<IntComparators>;
};

export type PerSectionAlignmentParametersWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

/** Record how frames get mapped to TiltSeries */
export type PerSectionParameters = EntityInterface & Node & {
  __typename?: 'PerSectionParameters';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  /** Angle of ast */
  astigmaticAngle?: Maybe<Scalars['Float']['output']>;
  /** Astigmatism amount for this frame */
  astigmatism?: Maybe<Scalars['Float']['output']>;
  /** defocus amount */
  defocus?: Maybe<Scalars['Float']['output']>;
  frame?: Maybe<Frame>;
  frameId: Scalars['Int']['output'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  tiltseries?: Maybe<Tiltseries>;
  tiltseriesId: Scalars['Int']['output'];
  /** z-index of the frame in the tiltseries */
  zIndex: Scalars['Int']['output'];
};


/** Record how frames get mapped to TiltSeries */
export type PerSectionParametersFrameArgs = {
  orderBy?: InputMaybe<Array<FrameOrderByClause>>;
  where?: InputMaybe<FrameWhereClause>;
};


/** Record how frames get mapped to TiltSeries */
export type PerSectionParametersTiltseriesArgs = {
  orderBy?: InputMaybe<Array<TiltseriesOrderByClause>>;
  where?: InputMaybe<TiltseriesWhereClause>;
};

export type PerSectionParametersAggregate = {
  __typename?: 'PerSectionParametersAggregate';
  aggregate?: Maybe<Array<PerSectionParametersAggregateFunctions>>;
};

export type PerSectionParametersAggregateFunctions = {
  __typename?: 'PerSectionParametersAggregateFunctions';
  avg?: Maybe<PerSectionParametersNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<PerSectionParametersGroupByOptions>;
  max?: Maybe<PerSectionParametersMinMaxColumns>;
  min?: Maybe<PerSectionParametersMinMaxColumns>;
  stddev?: Maybe<PerSectionParametersNumericalColumns>;
  sum?: Maybe<PerSectionParametersNumericalColumns>;
  variance?: Maybe<PerSectionParametersNumericalColumns>;
};


export type PerSectionParametersAggregateFunctionsCountArgs = {
  columns?: InputMaybe<PerSectionParametersCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type PerSectionParametersConnection = {
  __typename?: 'PerSectionParametersConnection';
  /** Contains the nodes in this connection */
  edges: Array<PerSectionParametersEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum PerSectionParametersCountColumns {
  AstigmaticAngle = 'astigmaticAngle',
  Astigmatism = 'astigmatism',
  Defocus = 'defocus',
  Frame = 'frame',
  Id = 'id',
  Tiltseries = 'tiltseries',
  ZIndex = 'zIndex'
}

export type PerSectionParametersCreateInput = {
  /** Angle of ast */
  astigmaticAngle?: InputMaybe<Scalars['Float']['input']>;
  /** Astigmatism amount for this frame */
  astigmatism?: InputMaybe<Scalars['Float']['input']>;
  /** defocus amount */
  defocus?: InputMaybe<Scalars['Float']['input']>;
  frameId: Scalars['ID']['input'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  tiltseriesId: Scalars['ID']['input'];
  /** z-index of the frame in the tiltseries */
  zIndex: Scalars['Int']['input'];
};

/** An edge in a connection. */
export type PerSectionParametersEdge = {
  __typename?: 'PerSectionParametersEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: PerSectionParameters;
};

export type PerSectionParametersGroupByOptions = {
  __typename?: 'PerSectionParametersGroupByOptions';
  astigmaticAngle?: Maybe<Scalars['Float']['output']>;
  astigmatism?: Maybe<Scalars['Float']['output']>;
  defocus?: Maybe<Scalars['Float']['output']>;
  frame?: Maybe<FrameGroupByOptions>;
  id?: Maybe<Scalars['Int']['output']>;
  tiltseries?: Maybe<TiltseriesGroupByOptions>;
  zIndex?: Maybe<Scalars['Int']['output']>;
};

export type PerSectionParametersMinMaxColumns = {
  __typename?: 'PerSectionParametersMinMaxColumns';
  astigmaticAngle?: Maybe<Scalars['Float']['output']>;
  astigmatism?: Maybe<Scalars['Float']['output']>;
  defocus?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  zIndex?: Maybe<Scalars['Int']['output']>;
};

export type PerSectionParametersNumericalColumns = {
  __typename?: 'PerSectionParametersNumericalColumns';
  astigmaticAngle?: Maybe<Scalars['Float']['output']>;
  astigmatism?: Maybe<Scalars['Float']['output']>;
  defocus?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  zIndex?: Maybe<Scalars['Int']['output']>;
};

export type PerSectionParametersOrderByClause = {
  astigmaticAngle?: InputMaybe<OrderBy>;
  astigmatism?: InputMaybe<OrderBy>;
  defocus?: InputMaybe<OrderBy>;
  frame?: InputMaybe<FrameOrderByClause>;
  id?: InputMaybe<OrderBy>;
  tiltseries?: InputMaybe<TiltseriesOrderByClause>;
  zIndex?: InputMaybe<OrderBy>;
};

export type PerSectionParametersUpdateInput = {
  /** Angle of ast */
  astigmaticAngle?: InputMaybe<Scalars['Float']['input']>;
  /** Astigmatism amount for this frame */
  astigmatism?: InputMaybe<Scalars['Float']['input']>;
  /** defocus amount */
  defocus?: InputMaybe<Scalars['Float']['input']>;
  frameId?: InputMaybe<Scalars['ID']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  tiltseriesId?: InputMaybe<Scalars['ID']['input']>;
  /** z-index of the frame in the tiltseries */
  zIndex?: InputMaybe<Scalars['Int']['input']>;
};

export type PerSectionParametersWhereClause = {
  astigmaticAngle?: InputMaybe<FloatComparators>;
  astigmatism?: InputMaybe<FloatComparators>;
  defocus?: InputMaybe<FloatComparators>;
  frame?: InputMaybe<FrameWhereClause>;
  id?: InputMaybe<IntComparators>;
  tiltseries?: InputMaybe<TiltseriesWhereClause>;
  zIndex?: InputMaybe<IntComparators>;
};

export type PerSectionParametersWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type Query = {
  __typename?: 'Query';
  alignments: Array<Alignment>;
  alignmentsAggregate: AlignmentAggregate;
  annotationAuthors: Array<AnnotationAuthor>;
  annotationAuthorsAggregate: AnnotationAuthorAggregate;
  annotationFiles: Array<AnnotationFile>;
  annotationFilesAggregate: AnnotationFileAggregate;
  annotationShapes: Array<AnnotationShape>;
  annotationShapesAggregate: AnnotationShapeAggregate;
  annotations: Array<Annotation>;
  annotationsAggregate: AnnotationAggregate;
  datasetAuthors: Array<DatasetAuthor>;
  datasetAuthorsAggregate: DatasetAuthorAggregate;
  datasetFunding: Array<DatasetFunding>;
  datasetFundingAggregate: DatasetFundingAggregate;
  datasets: Array<Dataset>;
  datasetsAggregate: DatasetAggregate;
  depositionAuthors: Array<DepositionAuthor>;
  depositionAuthorsAggregate: DepositionAuthorAggregate;
  depositionTypes: Array<DepositionType>;
  depositionTypesAggregate: DepositionTypeAggregate;
  depositions: Array<Deposition>;
  depositionsAggregate: DepositionAggregate;
  frames: Array<Frame>;
  framesAggregate: FrameAggregate;
  perSectionAlignmentParameters: Array<PerSectionAlignmentParameters>;
  perSectionAlignmentParametersAggregate: PerSectionAlignmentParametersAggregate;
  perSectionParameters: Array<PerSectionParameters>;
  perSectionParametersAggregate: PerSectionParametersAggregate;
  runs: Array<Run>;
  runsAggregate: RunAggregate;
  tiltseries: Array<Tiltseries>;
  tiltseriesAggregate: TiltseriesAggregate;
  tomogramAuthors: Array<TomogramAuthor>;
  tomogramAuthorsAggregate: TomogramAuthorAggregate;
  tomogramVoxelSpacings: Array<TomogramVoxelSpacing>;
  tomogramVoxelSpacingsAggregate: TomogramVoxelSpacingAggregate;
  tomograms: Array<Tomogram>;
  tomogramsAggregate: TomogramAggregate;
};


export type QueryAlignmentsArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<AlignmentOrderByClause>>;
  where?: InputMaybe<AlignmentWhereClause>;
};


export type QueryAlignmentsAggregateArgs = {
  where?: InputMaybe<AlignmentWhereClause>;
};


export type QueryAnnotationAuthorsArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<AnnotationAuthorOrderByClause>>;
  where?: InputMaybe<AnnotationAuthorWhereClause>;
};


export type QueryAnnotationAuthorsAggregateArgs = {
  where?: InputMaybe<AnnotationAuthorWhereClause>;
};


export type QueryAnnotationFilesArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<AnnotationFileOrderByClause>>;
  where?: InputMaybe<AnnotationFileWhereClause>;
};


export type QueryAnnotationFilesAggregateArgs = {
  where?: InputMaybe<AnnotationFileWhereClause>;
};


export type QueryAnnotationShapesArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<AnnotationShapeOrderByClause>>;
  where?: InputMaybe<AnnotationShapeWhereClause>;
};


export type QueryAnnotationShapesAggregateArgs = {
  where?: InputMaybe<AnnotationShapeWhereClause>;
};


export type QueryAnnotationsArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<AnnotationOrderByClause>>;
  where?: InputMaybe<AnnotationWhereClause>;
};


export type QueryAnnotationsAggregateArgs = {
  where?: InputMaybe<AnnotationWhereClause>;
};


export type QueryDatasetAuthorsArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<DatasetAuthorOrderByClause>>;
  where?: InputMaybe<DatasetAuthorWhereClause>;
};


export type QueryDatasetAuthorsAggregateArgs = {
  where?: InputMaybe<DatasetAuthorWhereClause>;
};


export type QueryDatasetFundingArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<DatasetFundingOrderByClause>>;
  where?: InputMaybe<DatasetFundingWhereClause>;
};


export type QueryDatasetFundingAggregateArgs = {
  where?: InputMaybe<DatasetFundingWhereClause>;
};


export type QueryDatasetsArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<DatasetOrderByClause>>;
  where?: InputMaybe<DatasetWhereClause>;
};


export type QueryDatasetsAggregateArgs = {
  where?: InputMaybe<DatasetWhereClause>;
};


export type QueryDepositionAuthorsArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<DepositionAuthorOrderByClause>>;
  where?: InputMaybe<DepositionAuthorWhereClause>;
};


export type QueryDepositionAuthorsAggregateArgs = {
  where?: InputMaybe<DepositionAuthorWhereClause>;
};


export type QueryDepositionTypesArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<DepositionTypeOrderByClause>>;
  where?: InputMaybe<DepositionTypeWhereClause>;
};


export type QueryDepositionTypesAggregateArgs = {
  where?: InputMaybe<DepositionTypeWhereClause>;
};


export type QueryDepositionsArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<DepositionOrderByClause>>;
  where?: InputMaybe<DepositionWhereClause>;
};


export type QueryDepositionsAggregateArgs = {
  where?: InputMaybe<DepositionWhereClause>;
};


export type QueryFramesArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<FrameOrderByClause>>;
  where?: InputMaybe<FrameWhereClause>;
};


export type QueryFramesAggregateArgs = {
  where?: InputMaybe<FrameWhereClause>;
};


export type QueryPerSectionAlignmentParametersArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<PerSectionAlignmentParametersOrderByClause>>;
  where?: InputMaybe<PerSectionAlignmentParametersWhereClause>;
};


export type QueryPerSectionAlignmentParametersAggregateArgs = {
  where?: InputMaybe<PerSectionAlignmentParametersWhereClause>;
};


export type QueryPerSectionParametersArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<PerSectionParametersOrderByClause>>;
  where?: InputMaybe<PerSectionParametersWhereClause>;
};


export type QueryPerSectionParametersAggregateArgs = {
  where?: InputMaybe<PerSectionParametersWhereClause>;
};


export type QueryRunsArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<RunOrderByClause>>;
  where?: InputMaybe<RunWhereClause>;
};


export type QueryRunsAggregateArgs = {
  where?: InputMaybe<RunWhereClause>;
};


export type QueryTiltseriesArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<TiltseriesOrderByClause>>;
  where?: InputMaybe<TiltseriesWhereClause>;
};


export type QueryTiltseriesAggregateArgs = {
  where?: InputMaybe<TiltseriesWhereClause>;
};


export type QueryTomogramAuthorsArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<TomogramAuthorOrderByClause>>;
  where?: InputMaybe<TomogramAuthorWhereClause>;
};


export type QueryTomogramAuthorsAggregateArgs = {
  where?: InputMaybe<TomogramAuthorWhereClause>;
};


export type QueryTomogramVoxelSpacingsArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<TomogramVoxelSpacingOrderByClause>>;
  where?: InputMaybe<TomogramVoxelSpacingWhereClause>;
};


export type QueryTomogramVoxelSpacingsAggregateArgs = {
  where?: InputMaybe<TomogramVoxelSpacingWhereClause>;
};


export type QueryTomogramsArgs = {
  limitOffset?: InputMaybe<LimitOffsetClause>;
  orderBy?: InputMaybe<Array<TomogramOrderByClause>>;
  where?: InputMaybe<TomogramWhereClause>;
};


export type QueryTomogramsAggregateArgs = {
  where?: InputMaybe<TomogramWhereClause>;
};

export type Run = EntityInterface & Node & {
  __typename?: 'Run';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  alignments: AlignmentConnection;
  alignmentsAggregate?: Maybe<AlignmentAggregate>;
  annotations: AnnotationConnection;
  annotationsAggregate?: Maybe<AnnotationAggregate>;
  dataset?: Maybe<Dataset>;
  datasetId: Scalars['Int']['output'];
  frames: FrameConnection;
  framesAggregate?: Maybe<FrameAggregate>;
  /** Path to a directory containing data for this entity as an HTTPS url */
  httpsPrefix: Scalars['String']['output'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** Name of a run */
  name: Scalars['String']['output'];
  /** Path to a directory containing data for this entity as an S3 url */
  s3Prefix: Scalars['String']['output'];
  tiltseries: TiltseriesConnection;
  tiltseriesAggregate?: Maybe<TiltseriesAggregate>;
  tomogramVoxelSpacings: TomogramVoxelSpacingConnection;
  tomogramVoxelSpacingsAggregate?: Maybe<TomogramVoxelSpacingAggregate>;
  tomograms: TomogramConnection;
  tomogramsAggregate?: Maybe<TomogramAggregate>;
};


export type RunAlignmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AlignmentOrderByClause>>;
  where?: InputMaybe<AlignmentWhereClause>;
};


export type RunAlignmentsAggregateArgs = {
  where?: InputMaybe<AlignmentWhereClause>;
};


export type RunAnnotationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AnnotationOrderByClause>>;
  where?: InputMaybe<AnnotationWhereClause>;
};


export type RunAnnotationsAggregateArgs = {
  where?: InputMaybe<AnnotationWhereClause>;
};


export type RunDatasetArgs = {
  orderBy?: InputMaybe<Array<DatasetOrderByClause>>;
  where?: InputMaybe<DatasetWhereClause>;
};


export type RunFramesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FrameOrderByClause>>;
  where?: InputMaybe<FrameWhereClause>;
};


export type RunFramesAggregateArgs = {
  where?: InputMaybe<FrameWhereClause>;
};


export type RunTiltseriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TiltseriesOrderByClause>>;
  where?: InputMaybe<TiltseriesWhereClause>;
};


export type RunTiltseriesAggregateArgs = {
  where?: InputMaybe<TiltseriesWhereClause>;
};


export type RunTomogramVoxelSpacingsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TomogramVoxelSpacingOrderByClause>>;
  where?: InputMaybe<TomogramVoxelSpacingWhereClause>;
};


export type RunTomogramVoxelSpacingsAggregateArgs = {
  where?: InputMaybe<TomogramVoxelSpacingWhereClause>;
};


export type RunTomogramsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TomogramOrderByClause>>;
  where?: InputMaybe<TomogramWhereClause>;
};


export type RunTomogramsAggregateArgs = {
  where?: InputMaybe<TomogramWhereClause>;
};

export type RunAggregate = {
  __typename?: 'RunAggregate';
  aggregate?: Maybe<Array<RunAggregateFunctions>>;
};

export type RunAggregateFunctions = {
  __typename?: 'RunAggregateFunctions';
  avg?: Maybe<RunNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<RunGroupByOptions>;
  max?: Maybe<RunMinMaxColumns>;
  min?: Maybe<RunMinMaxColumns>;
  stddev?: Maybe<RunNumericalColumns>;
  sum?: Maybe<RunNumericalColumns>;
  variance?: Maybe<RunNumericalColumns>;
};


export type RunAggregateFunctionsCountArgs = {
  columns?: InputMaybe<RunCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type RunConnection = {
  __typename?: 'RunConnection';
  /** Contains the nodes in this connection */
  edges: Array<RunEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum RunCountColumns {
  Alignments = 'alignments',
  Annotations = 'annotations',
  Dataset = 'dataset',
  Frames = 'frames',
  HttpsPrefix = 'httpsPrefix',
  Id = 'id',
  Name = 'name',
  S3Prefix = 's3Prefix',
  Tiltseries = 'tiltseries',
  TomogramVoxelSpacings = 'tomogramVoxelSpacings',
  Tomograms = 'tomograms'
}

export type RunCreateInput = {
  /** An author of a dataset */
  datasetId: Scalars['ID']['input'];
  /** Path to a directory containing data for this entity as an HTTPS url */
  httpsPrefix: Scalars['String']['input'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** Name of a run */
  name: Scalars['String']['input'];
  /** Path to a directory containing data for this entity as an S3 url */
  s3Prefix: Scalars['String']['input'];
};

/** An edge in a connection. */
export type RunEdge = {
  __typename?: 'RunEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Run;
};

export type RunGroupByOptions = {
  __typename?: 'RunGroupByOptions';
  dataset?: Maybe<DatasetGroupByOptions>;
  httpsPrefix?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  s3Prefix?: Maybe<Scalars['String']['output']>;
};

export type RunMinMaxColumns = {
  __typename?: 'RunMinMaxColumns';
  httpsPrefix?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  s3Prefix?: Maybe<Scalars['String']['output']>;
};

export type RunNumericalColumns = {
  __typename?: 'RunNumericalColumns';
  id?: Maybe<Scalars['Int']['output']>;
};

export type RunOrderByClause = {
  dataset?: InputMaybe<DatasetOrderByClause>;
  httpsPrefix?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  s3Prefix?: InputMaybe<OrderBy>;
};

export type RunUpdateInput = {
  /** An author of a dataset */
  datasetId?: InputMaybe<Scalars['ID']['input']>;
  /** Path to a directory containing data for this entity as an HTTPS url */
  httpsPrefix?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Name of a run */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Path to a directory containing data for this entity as an S3 url */
  s3Prefix?: InputMaybe<Scalars['String']['input']>;
};

export type RunWhereClause = {
  alignments?: InputMaybe<AlignmentWhereClause>;
  annotations?: InputMaybe<AnnotationWhereClause>;
  dataset?: InputMaybe<DatasetWhereClause>;
  frames?: InputMaybe<FrameWhereClause>;
  httpsPrefix?: InputMaybe<StrComparators>;
  id?: InputMaybe<IntComparators>;
  name?: InputMaybe<StrComparators>;
  s3Prefix?: InputMaybe<StrComparators>;
  tiltseries?: InputMaybe<TiltseriesWhereClause>;
  tomogramVoxelSpacings?: InputMaybe<TomogramVoxelSpacingWhereClause>;
  tomograms?: InputMaybe<TomogramWhereClause>;
};

export type RunWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type Sample_Type_EnumEnumComparators = {
  _eq?: InputMaybe<Sample_Type_Enum>;
  _gt?: InputMaybe<Sample_Type_Enum>;
  _gte?: InputMaybe<Sample_Type_Enum>;
  _in?: InputMaybe<Array<Sample_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Sample_Type_Enum>;
  _lte?: InputMaybe<Sample_Type_Enum>;
  _neq?: InputMaybe<Sample_Type_Enum>;
  _nin?: InputMaybe<Array<Sample_Type_Enum>>;
};

export type StrComparators = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  _niregex?: InputMaybe<Scalars['String']['input']>;
  _nlike?: InputMaybe<Scalars['String']['input']>;
  _nregex?: InputMaybe<Scalars['String']['input']>;
  _regex?: InputMaybe<Scalars['String']['input']>;
};

export type Tiltseries = EntityInterface & Node & {
  __typename?: 'Tiltseries';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  /** Electron Microscope Accelerator voltage in volts */
  accelerationVoltage: Scalars['Float']['output'];
  /** Binning factor of the aligned tilt series */
  alignedTiltseriesBinning?: Maybe<Scalars['Float']['output']>;
  alignments: AlignmentConnection;
  alignmentsAggregate?: Maybe<AlignmentAggregate>;
  /** Describes the binning factor from frames to tilt series file */
  binningFromFrames?: Maybe<Scalars['Float']['output']>;
  /** Name of the camera manufacturer */
  cameraManufacturer: Scalars['String']['output'];
  /** Camera model name */
  cameraModel: Scalars['String']['output'];
  /** Software used to collect data */
  dataAcquisitionSoftware: Scalars['String']['output'];
  deposition?: Maybe<Deposition>;
  depositionId?: Maybe<Scalars['Int']['output']>;
  /** HTTPS path to the angle list file for this tiltseries */
  httpsAngleList?: Maybe<Scalars['String']['output']>;
  /** HTTPS path to the collection metadata file for this tiltseries */
  httpsCollectionMetadata?: Maybe<Scalars['String']['output']>;
  /** HTTPS path to the gain file for this tiltseries */
  httpsGainFile?: Maybe<Scalars['String']['output']>;
  /** HTTPS path to this tiltseries in MRC format (no scaling) */
  httpsMrcFile?: Maybe<Scalars['String']['output']>;
  /** HTTPS path to this tiltseries in multiscale OME-Zarr format */
  httpsOmezarrDir?: Maybe<Scalars['String']['output']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** Whether this tilt series is aligned */
  isAligned: Scalars['Boolean']['output'];
  /** Other microscope optical setup information, in addition to energy filter, phase plate and image corrector */
  microscopeAdditionalInfo?: Maybe<Scalars['String']['output']>;
  /** Energy filter setup used */
  microscopeEnergyFilter: Scalars['String']['output'];
  /** Image corrector setup */
  microscopeImageCorrector?: Maybe<Scalars['String']['output']>;
  /** Name of the microscope manufacturer */
  microscopeManufacturer: Tiltseries_Microscope_Manufacturer_Enum;
  /** Microscope model name */
  microscopeModel: Scalars['String']['output'];
  /** Phase plate configuration */
  microscopePhasePlate?: Maybe<Scalars['String']['output']>;
  perSectionParameters: PerSectionParametersConnection;
  perSectionParametersAggregate?: Maybe<PerSectionParametersAggregate>;
  /** Pixel spacing for the tilt series */
  pixelSpacing: Scalars['Float']['output'];
  /** If a tilt series is deposited into EMPIAR, enter the EMPIAR dataset identifier */
  relatedEmpiarEntry?: Maybe<Scalars['String']['output']>;
  run?: Maybe<Run>;
  runId: Scalars['Int']['output'];
  /** S3 path to the angle list file for this tiltseries */
  s3AngleList?: Maybe<Scalars['String']['output']>;
  /** S3 path to the collection metadata file for this tiltseries */
  s3CollectionMetadata?: Maybe<Scalars['String']['output']>;
  /** S3 path to the gain file for this tiltseries */
  s3GainFile?: Maybe<Scalars['String']['output']>;
  /** S3 path to this tiltseries in MRC format (no scaling) */
  s3MrcFile?: Maybe<Scalars['String']['output']>;
  /** S3 path to this tiltseries in multiscale OME-Zarr format */
  s3OmezarrDir?: Maybe<Scalars['String']['output']>;
  /** Spherical Aberration Constant of the objective lens in millimeters */
  sphericalAberrationConstant: Scalars['Float']['output'];
  /** Rotation angle in degrees */
  tiltAxis: Scalars['Float']['output'];
  /** Maximal tilt angle in degrees */
  tiltMax: Scalars['Float']['output'];
  /** Minimal tilt angle in degrees */
  tiltMin: Scalars['Float']['output'];
  /** Total tilt range from min to max in degrees */
  tiltRange: Scalars['Float']['output'];
  /** Author assessment of tilt series quality within the dataset (1-5, 5 is best) */
  tiltSeriesQuality: Scalars['Int']['output'];
  /** Tilt step in degrees */
  tiltStep: Scalars['Float']['output'];
  /** The order of stage tilting during acquisition of the data */
  tiltingScheme: Scalars['String']['output'];
  /** Number of frames associated with this tiltseries */
  tiltseriesFramesCount?: Maybe<Scalars['Int']['output']>;
  /** Number of Electrons reaching the specimen in a square Angstrom area for the entire tilt series */
  totalFlux: Scalars['Float']['output'];
};


export type TiltseriesAlignmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AlignmentOrderByClause>>;
  where?: InputMaybe<AlignmentWhereClause>;
};


export type TiltseriesAlignmentsAggregateArgs = {
  where?: InputMaybe<AlignmentWhereClause>;
};


export type TiltseriesDepositionArgs = {
  orderBy?: InputMaybe<Array<DepositionOrderByClause>>;
  where?: InputMaybe<DepositionWhereClause>;
};


export type TiltseriesPerSectionParametersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PerSectionParametersOrderByClause>>;
  where?: InputMaybe<PerSectionParametersWhereClause>;
};


export type TiltseriesPerSectionParametersAggregateArgs = {
  where?: InputMaybe<PerSectionParametersWhereClause>;
};


export type TiltseriesRunArgs = {
  orderBy?: InputMaybe<Array<RunOrderByClause>>;
  where?: InputMaybe<RunWhereClause>;
};

export type TiltseriesAggregate = {
  __typename?: 'TiltseriesAggregate';
  aggregate?: Maybe<Array<TiltseriesAggregateFunctions>>;
};

export type TiltseriesAggregateFunctions = {
  __typename?: 'TiltseriesAggregateFunctions';
  avg?: Maybe<TiltseriesNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<TiltseriesGroupByOptions>;
  max?: Maybe<TiltseriesMinMaxColumns>;
  min?: Maybe<TiltseriesMinMaxColumns>;
  stddev?: Maybe<TiltseriesNumericalColumns>;
  sum?: Maybe<TiltseriesNumericalColumns>;
  variance?: Maybe<TiltseriesNumericalColumns>;
};


export type TiltseriesAggregateFunctionsCountArgs = {
  columns?: InputMaybe<TiltseriesCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type TiltseriesConnection = {
  __typename?: 'TiltseriesConnection';
  /** Contains the nodes in this connection */
  edges: Array<TiltseriesEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum TiltseriesCountColumns {
  AccelerationVoltage = 'accelerationVoltage',
  AlignedTiltseriesBinning = 'alignedTiltseriesBinning',
  Alignments = 'alignments',
  BinningFromFrames = 'binningFromFrames',
  CameraManufacturer = 'cameraManufacturer',
  CameraModel = 'cameraModel',
  DataAcquisitionSoftware = 'dataAcquisitionSoftware',
  Deposition = 'deposition',
  HttpsAngleList = 'httpsAngleList',
  HttpsCollectionMetadata = 'httpsCollectionMetadata',
  HttpsGainFile = 'httpsGainFile',
  HttpsMrcFile = 'httpsMrcFile',
  HttpsOmezarrDir = 'httpsOmezarrDir',
  Id = 'id',
  IsAligned = 'isAligned',
  MicroscopeAdditionalInfo = 'microscopeAdditionalInfo',
  MicroscopeEnergyFilter = 'microscopeEnergyFilter',
  MicroscopeImageCorrector = 'microscopeImageCorrector',
  MicroscopeManufacturer = 'microscopeManufacturer',
  MicroscopeModel = 'microscopeModel',
  MicroscopePhasePlate = 'microscopePhasePlate',
  PerSectionParameters = 'perSectionParameters',
  PixelSpacing = 'pixelSpacing',
  RelatedEmpiarEntry = 'relatedEmpiarEntry',
  Run = 'run',
  S3AngleList = 's3AngleList',
  S3CollectionMetadata = 's3CollectionMetadata',
  S3GainFile = 's3GainFile',
  S3MrcFile = 's3MrcFile',
  S3OmezarrDir = 's3OmezarrDir',
  SphericalAberrationConstant = 'sphericalAberrationConstant',
  TiltAxis = 'tiltAxis',
  TiltMax = 'tiltMax',
  TiltMin = 'tiltMin',
  TiltRange = 'tiltRange',
  TiltSeriesQuality = 'tiltSeriesQuality',
  TiltStep = 'tiltStep',
  TiltingScheme = 'tiltingScheme',
  TiltseriesFramesCount = 'tiltseriesFramesCount',
  TotalFlux = 'totalFlux'
}

export type TiltseriesCreateInput = {
  /** Electron Microscope Accelerator voltage in volts */
  accelerationVoltage: Scalars['Float']['input'];
  /** Binning factor of the aligned tilt series */
  alignedTiltseriesBinning?: InputMaybe<Scalars['Float']['input']>;
  /** Describes the binning factor from frames to tilt series file */
  binningFromFrames?: InputMaybe<Scalars['Float']['input']>;
  /** Name of the camera manufacturer */
  cameraManufacturer: Scalars['String']['input'];
  /** Camera model name */
  cameraModel: Scalars['String']['input'];
  /** Software used to collect data */
  dataAcquisitionSoftware: Scalars['String']['input'];
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** HTTPS path to the angle list file for this tiltseries */
  httpsAngleList?: InputMaybe<Scalars['String']['input']>;
  /** HTTPS path to the collection metadata file for this tiltseries */
  httpsCollectionMetadata?: InputMaybe<Scalars['String']['input']>;
  /** HTTPS path to the gain file for this tiltseries */
  httpsGainFile?: InputMaybe<Scalars['String']['input']>;
  /** HTTPS path to this tiltseries in MRC format (no scaling) */
  httpsMrcFile?: InputMaybe<Scalars['String']['input']>;
  /** HTTPS path to this tiltseries in multiscale OME-Zarr format */
  httpsOmezarrDir?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** Whether this tilt series is aligned */
  isAligned: Scalars['Boolean']['input'];
  /** Other microscope optical setup information, in addition to energy filter, phase plate and image corrector */
  microscopeAdditionalInfo?: InputMaybe<Scalars['String']['input']>;
  /** Energy filter setup used */
  microscopeEnergyFilter: Scalars['String']['input'];
  /** Image corrector setup */
  microscopeImageCorrector?: InputMaybe<Scalars['String']['input']>;
  /** Name of the microscope manufacturer */
  microscopeManufacturer: Tiltseries_Microscope_Manufacturer_Enum;
  /** Microscope model name */
  microscopeModel: Scalars['String']['input'];
  /** Phase plate configuration */
  microscopePhasePlate?: InputMaybe<Scalars['String']['input']>;
  /** Pixel spacing for the tilt series */
  pixelSpacing: Scalars['Float']['input'];
  /** If a tilt series is deposited into EMPIAR, enter the EMPIAR dataset identifier */
  relatedEmpiarEntry?: InputMaybe<Scalars['String']['input']>;
  runId: Scalars['ID']['input'];
  /** S3 path to the angle list file for this tiltseries */
  s3AngleList?: InputMaybe<Scalars['String']['input']>;
  /** S3 path to the collection metadata file for this tiltseries */
  s3CollectionMetadata?: InputMaybe<Scalars['String']['input']>;
  /** S3 path to the gain file for this tiltseries */
  s3GainFile?: InputMaybe<Scalars['String']['input']>;
  /** S3 path to this tiltseries in MRC format (no scaling) */
  s3MrcFile?: InputMaybe<Scalars['String']['input']>;
  /** S3 path to this tiltseries in multiscale OME-Zarr format */
  s3OmezarrDir?: InputMaybe<Scalars['String']['input']>;
  /** Spherical Aberration Constant of the objective lens in millimeters */
  sphericalAberrationConstant: Scalars['Float']['input'];
  /** Rotation angle in degrees */
  tiltAxis: Scalars['Float']['input'];
  /** Maximal tilt angle in degrees */
  tiltMax: Scalars['Float']['input'];
  /** Minimal tilt angle in degrees */
  tiltMin: Scalars['Float']['input'];
  /** Total tilt range from min to max in degrees */
  tiltRange: Scalars['Float']['input'];
  /** Author assessment of tilt series quality within the dataset (1-5, 5 is best) */
  tiltSeriesQuality: Scalars['Int']['input'];
  /** Tilt step in degrees */
  tiltStep: Scalars['Float']['input'];
  /** The order of stage tilting during acquisition of the data */
  tiltingScheme: Scalars['String']['input'];
  /** Number of frames associated with this tiltseries */
  tiltseriesFramesCount?: InputMaybe<Scalars['Int']['input']>;
  /** Number of Electrons reaching the specimen in a square Angstrom area for the entire tilt series */
  totalFlux: Scalars['Float']['input'];
};

/** An edge in a connection. */
export type TiltseriesEdge = {
  __typename?: 'TiltseriesEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Tiltseries;
};

export type TiltseriesGroupByOptions = {
  __typename?: 'TiltseriesGroupByOptions';
  accelerationVoltage?: Maybe<Scalars['Float']['output']>;
  alignedTiltseriesBinning?: Maybe<Scalars['Float']['output']>;
  binningFromFrames?: Maybe<Scalars['Float']['output']>;
  cameraManufacturer?: Maybe<Scalars['String']['output']>;
  cameraModel?: Maybe<Scalars['String']['output']>;
  dataAcquisitionSoftware?: Maybe<Scalars['String']['output']>;
  deposition?: Maybe<DepositionGroupByOptions>;
  httpsAngleList?: Maybe<Scalars['String']['output']>;
  httpsCollectionMetadata?: Maybe<Scalars['String']['output']>;
  httpsGainFile?: Maybe<Scalars['String']['output']>;
  httpsMrcFile?: Maybe<Scalars['String']['output']>;
  httpsOmezarrDir?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  isAligned?: Maybe<Scalars['Boolean']['output']>;
  microscopeAdditionalInfo?: Maybe<Scalars['String']['output']>;
  microscopeEnergyFilter?: Maybe<Scalars['String']['output']>;
  microscopeImageCorrector?: Maybe<Scalars['String']['output']>;
  microscopeManufacturer?: Maybe<Tiltseries_Microscope_Manufacturer_Enum>;
  microscopeModel?: Maybe<Scalars['String']['output']>;
  microscopePhasePlate?: Maybe<Scalars['String']['output']>;
  pixelSpacing?: Maybe<Scalars['Float']['output']>;
  relatedEmpiarEntry?: Maybe<Scalars['String']['output']>;
  run?: Maybe<RunGroupByOptions>;
  s3AngleList?: Maybe<Scalars['String']['output']>;
  s3CollectionMetadata?: Maybe<Scalars['String']['output']>;
  s3GainFile?: Maybe<Scalars['String']['output']>;
  s3MrcFile?: Maybe<Scalars['String']['output']>;
  s3OmezarrDir?: Maybe<Scalars['String']['output']>;
  sphericalAberrationConstant?: Maybe<Scalars['Float']['output']>;
  tiltAxis?: Maybe<Scalars['Float']['output']>;
  tiltMax?: Maybe<Scalars['Float']['output']>;
  tiltMin?: Maybe<Scalars['Float']['output']>;
  tiltRange?: Maybe<Scalars['Float']['output']>;
  tiltSeriesQuality?: Maybe<Scalars['Int']['output']>;
  tiltStep?: Maybe<Scalars['Float']['output']>;
  tiltingScheme?: Maybe<Scalars['String']['output']>;
  tiltseriesFramesCount?: Maybe<Scalars['Int']['output']>;
  totalFlux?: Maybe<Scalars['Float']['output']>;
};

export type TiltseriesMinMaxColumns = {
  __typename?: 'TiltseriesMinMaxColumns';
  accelerationVoltage?: Maybe<Scalars['Float']['output']>;
  alignedTiltseriesBinning?: Maybe<Scalars['Float']['output']>;
  binningFromFrames?: Maybe<Scalars['Float']['output']>;
  cameraManufacturer?: Maybe<Scalars['String']['output']>;
  cameraModel?: Maybe<Scalars['String']['output']>;
  dataAcquisitionSoftware?: Maybe<Scalars['String']['output']>;
  httpsAngleList?: Maybe<Scalars['String']['output']>;
  httpsCollectionMetadata?: Maybe<Scalars['String']['output']>;
  httpsGainFile?: Maybe<Scalars['String']['output']>;
  httpsMrcFile?: Maybe<Scalars['String']['output']>;
  httpsOmezarrDir?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  microscopeAdditionalInfo?: Maybe<Scalars['String']['output']>;
  microscopeEnergyFilter?: Maybe<Scalars['String']['output']>;
  microscopeImageCorrector?: Maybe<Scalars['String']['output']>;
  microscopeModel?: Maybe<Scalars['String']['output']>;
  microscopePhasePlate?: Maybe<Scalars['String']['output']>;
  pixelSpacing?: Maybe<Scalars['Float']['output']>;
  relatedEmpiarEntry?: Maybe<Scalars['String']['output']>;
  s3AngleList?: Maybe<Scalars['String']['output']>;
  s3CollectionMetadata?: Maybe<Scalars['String']['output']>;
  s3GainFile?: Maybe<Scalars['String']['output']>;
  s3MrcFile?: Maybe<Scalars['String']['output']>;
  s3OmezarrDir?: Maybe<Scalars['String']['output']>;
  sphericalAberrationConstant?: Maybe<Scalars['Float']['output']>;
  tiltAxis?: Maybe<Scalars['Float']['output']>;
  tiltMax?: Maybe<Scalars['Float']['output']>;
  tiltMin?: Maybe<Scalars['Float']['output']>;
  tiltRange?: Maybe<Scalars['Float']['output']>;
  tiltSeriesQuality?: Maybe<Scalars['Int']['output']>;
  tiltStep?: Maybe<Scalars['Float']['output']>;
  tiltingScheme?: Maybe<Scalars['String']['output']>;
  tiltseriesFramesCount?: Maybe<Scalars['Int']['output']>;
  totalFlux?: Maybe<Scalars['Float']['output']>;
};

export type TiltseriesNumericalColumns = {
  __typename?: 'TiltseriesNumericalColumns';
  accelerationVoltage?: Maybe<Scalars['Float']['output']>;
  alignedTiltseriesBinning?: Maybe<Scalars['Float']['output']>;
  binningFromFrames?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  pixelSpacing?: Maybe<Scalars['Float']['output']>;
  sphericalAberrationConstant?: Maybe<Scalars['Float']['output']>;
  tiltAxis?: Maybe<Scalars['Float']['output']>;
  tiltMax?: Maybe<Scalars['Float']['output']>;
  tiltMin?: Maybe<Scalars['Float']['output']>;
  tiltRange?: Maybe<Scalars['Float']['output']>;
  tiltSeriesQuality?: Maybe<Scalars['Int']['output']>;
  tiltStep?: Maybe<Scalars['Float']['output']>;
  tiltseriesFramesCount?: Maybe<Scalars['Int']['output']>;
  totalFlux?: Maybe<Scalars['Float']['output']>;
};

export type TiltseriesOrderByClause = {
  accelerationVoltage?: InputMaybe<OrderBy>;
  alignedTiltseriesBinning?: InputMaybe<OrderBy>;
  binningFromFrames?: InputMaybe<OrderBy>;
  cameraManufacturer?: InputMaybe<OrderBy>;
  cameraModel?: InputMaybe<OrderBy>;
  dataAcquisitionSoftware?: InputMaybe<OrderBy>;
  deposition?: InputMaybe<DepositionOrderByClause>;
  httpsAngleList?: InputMaybe<OrderBy>;
  httpsCollectionMetadata?: InputMaybe<OrderBy>;
  httpsGainFile?: InputMaybe<OrderBy>;
  httpsMrcFile?: InputMaybe<OrderBy>;
  httpsOmezarrDir?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isAligned?: InputMaybe<OrderBy>;
  microscopeAdditionalInfo?: InputMaybe<OrderBy>;
  microscopeEnergyFilter?: InputMaybe<OrderBy>;
  microscopeImageCorrector?: InputMaybe<OrderBy>;
  microscopeManufacturer?: InputMaybe<OrderBy>;
  microscopeModel?: InputMaybe<OrderBy>;
  microscopePhasePlate?: InputMaybe<OrderBy>;
  pixelSpacing?: InputMaybe<OrderBy>;
  relatedEmpiarEntry?: InputMaybe<OrderBy>;
  run?: InputMaybe<RunOrderByClause>;
  s3AngleList?: InputMaybe<OrderBy>;
  s3CollectionMetadata?: InputMaybe<OrderBy>;
  s3GainFile?: InputMaybe<OrderBy>;
  s3MrcFile?: InputMaybe<OrderBy>;
  s3OmezarrDir?: InputMaybe<OrderBy>;
  sphericalAberrationConstant?: InputMaybe<OrderBy>;
  tiltAxis?: InputMaybe<OrderBy>;
  tiltMax?: InputMaybe<OrderBy>;
  tiltMin?: InputMaybe<OrderBy>;
  tiltRange?: InputMaybe<OrderBy>;
  tiltSeriesQuality?: InputMaybe<OrderBy>;
  tiltStep?: InputMaybe<OrderBy>;
  tiltingScheme?: InputMaybe<OrderBy>;
  tiltseriesFramesCount?: InputMaybe<OrderBy>;
  totalFlux?: InputMaybe<OrderBy>;
};

export type TiltseriesUpdateInput = {
  /** Electron Microscope Accelerator voltage in volts */
  accelerationVoltage?: InputMaybe<Scalars['Float']['input']>;
  /** Binning factor of the aligned tilt series */
  alignedTiltseriesBinning?: InputMaybe<Scalars['Float']['input']>;
  /** Describes the binning factor from frames to tilt series file */
  binningFromFrames?: InputMaybe<Scalars['Float']['input']>;
  /** Name of the camera manufacturer */
  cameraManufacturer?: InputMaybe<Scalars['String']['input']>;
  /** Camera model name */
  cameraModel?: InputMaybe<Scalars['String']['input']>;
  /** Software used to collect data */
  dataAcquisitionSoftware?: InputMaybe<Scalars['String']['input']>;
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** HTTPS path to the angle list file for this tiltseries */
  httpsAngleList?: InputMaybe<Scalars['String']['input']>;
  /** HTTPS path to the collection metadata file for this tiltseries */
  httpsCollectionMetadata?: InputMaybe<Scalars['String']['input']>;
  /** HTTPS path to the gain file for this tiltseries */
  httpsGainFile?: InputMaybe<Scalars['String']['input']>;
  /** HTTPS path to this tiltseries in MRC format (no scaling) */
  httpsMrcFile?: InputMaybe<Scalars['String']['input']>;
  /** HTTPS path to this tiltseries in multiscale OME-Zarr format */
  httpsOmezarrDir?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Whether this tilt series is aligned */
  isAligned?: InputMaybe<Scalars['Boolean']['input']>;
  /** Other microscope optical setup information, in addition to energy filter, phase plate and image corrector */
  microscopeAdditionalInfo?: InputMaybe<Scalars['String']['input']>;
  /** Energy filter setup used */
  microscopeEnergyFilter?: InputMaybe<Scalars['String']['input']>;
  /** Image corrector setup */
  microscopeImageCorrector?: InputMaybe<Scalars['String']['input']>;
  /** Name of the microscope manufacturer */
  microscopeManufacturer?: InputMaybe<Tiltseries_Microscope_Manufacturer_Enum>;
  /** Microscope model name */
  microscopeModel?: InputMaybe<Scalars['String']['input']>;
  /** Phase plate configuration */
  microscopePhasePlate?: InputMaybe<Scalars['String']['input']>;
  /** Pixel spacing for the tilt series */
  pixelSpacing?: InputMaybe<Scalars['Float']['input']>;
  /** If a tilt series is deposited into EMPIAR, enter the EMPIAR dataset identifier */
  relatedEmpiarEntry?: InputMaybe<Scalars['String']['input']>;
  runId?: InputMaybe<Scalars['ID']['input']>;
  /** S3 path to the angle list file for this tiltseries */
  s3AngleList?: InputMaybe<Scalars['String']['input']>;
  /** S3 path to the collection metadata file for this tiltseries */
  s3CollectionMetadata?: InputMaybe<Scalars['String']['input']>;
  /** S3 path to the gain file for this tiltseries */
  s3GainFile?: InputMaybe<Scalars['String']['input']>;
  /** S3 path to this tiltseries in MRC format (no scaling) */
  s3MrcFile?: InputMaybe<Scalars['String']['input']>;
  /** S3 path to this tiltseries in multiscale OME-Zarr format */
  s3OmezarrDir?: InputMaybe<Scalars['String']['input']>;
  /** Spherical Aberration Constant of the objective lens in millimeters */
  sphericalAberrationConstant?: InputMaybe<Scalars['Float']['input']>;
  /** Rotation angle in degrees */
  tiltAxis?: InputMaybe<Scalars['Float']['input']>;
  /** Maximal tilt angle in degrees */
  tiltMax?: InputMaybe<Scalars['Float']['input']>;
  /** Minimal tilt angle in degrees */
  tiltMin?: InputMaybe<Scalars['Float']['input']>;
  /** Total tilt range from min to max in degrees */
  tiltRange?: InputMaybe<Scalars['Float']['input']>;
  /** Author assessment of tilt series quality within the dataset (1-5, 5 is best) */
  tiltSeriesQuality?: InputMaybe<Scalars['Int']['input']>;
  /** Tilt step in degrees */
  tiltStep?: InputMaybe<Scalars['Float']['input']>;
  /** The order of stage tilting during acquisition of the data */
  tiltingScheme?: InputMaybe<Scalars['String']['input']>;
  /** Number of frames associated with this tiltseries */
  tiltseriesFramesCount?: InputMaybe<Scalars['Int']['input']>;
  /** Number of Electrons reaching the specimen in a square Angstrom area for the entire tilt series */
  totalFlux?: InputMaybe<Scalars['Float']['input']>;
};

export type TiltseriesWhereClause = {
  accelerationVoltage?: InputMaybe<FloatComparators>;
  alignedTiltseriesBinning?: InputMaybe<FloatComparators>;
  alignments?: InputMaybe<AlignmentWhereClause>;
  binningFromFrames?: InputMaybe<FloatComparators>;
  cameraManufacturer?: InputMaybe<StrComparators>;
  cameraModel?: InputMaybe<StrComparators>;
  dataAcquisitionSoftware?: InputMaybe<StrComparators>;
  deposition?: InputMaybe<DepositionWhereClause>;
  httpsAngleList?: InputMaybe<StrComparators>;
  httpsCollectionMetadata?: InputMaybe<StrComparators>;
  httpsGainFile?: InputMaybe<StrComparators>;
  httpsMrcFile?: InputMaybe<StrComparators>;
  httpsOmezarrDir?: InputMaybe<StrComparators>;
  id?: InputMaybe<IntComparators>;
  isAligned?: InputMaybe<BoolComparators>;
  microscopeAdditionalInfo?: InputMaybe<StrComparators>;
  microscopeEnergyFilter?: InputMaybe<StrComparators>;
  microscopeImageCorrector?: InputMaybe<StrComparators>;
  microscopeManufacturer?: InputMaybe<Tiltseries_Microscope_Manufacturer_EnumEnumComparators>;
  microscopeModel?: InputMaybe<StrComparators>;
  microscopePhasePlate?: InputMaybe<StrComparators>;
  perSectionParameters?: InputMaybe<PerSectionParametersWhereClause>;
  pixelSpacing?: InputMaybe<FloatComparators>;
  relatedEmpiarEntry?: InputMaybe<StrComparators>;
  run?: InputMaybe<RunWhereClause>;
  s3AngleList?: InputMaybe<StrComparators>;
  s3CollectionMetadata?: InputMaybe<StrComparators>;
  s3GainFile?: InputMaybe<StrComparators>;
  s3MrcFile?: InputMaybe<StrComparators>;
  s3OmezarrDir?: InputMaybe<StrComparators>;
  sphericalAberrationConstant?: InputMaybe<FloatComparators>;
  tiltAxis?: InputMaybe<FloatComparators>;
  tiltMax?: InputMaybe<FloatComparators>;
  tiltMin?: InputMaybe<FloatComparators>;
  tiltRange?: InputMaybe<FloatComparators>;
  tiltSeriesQuality?: InputMaybe<IntComparators>;
  tiltStep?: InputMaybe<FloatComparators>;
  tiltingScheme?: InputMaybe<StrComparators>;
  tiltseriesFramesCount?: InputMaybe<IntComparators>;
  totalFlux?: InputMaybe<FloatComparators>;
};

export type TiltseriesWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type Tiltseries_Microscope_Manufacturer_EnumEnumComparators = {
  _eq?: InputMaybe<Tiltseries_Microscope_Manufacturer_Enum>;
  _gt?: InputMaybe<Tiltseries_Microscope_Manufacturer_Enum>;
  _gte?: InputMaybe<Tiltseries_Microscope_Manufacturer_Enum>;
  _in?: InputMaybe<Array<Tiltseries_Microscope_Manufacturer_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Tiltseries_Microscope_Manufacturer_Enum>;
  _lte?: InputMaybe<Tiltseries_Microscope_Manufacturer_Enum>;
  _neq?: InputMaybe<Tiltseries_Microscope_Manufacturer_Enum>;
  _nin?: InputMaybe<Array<Tiltseries_Microscope_Manufacturer_Enum>>;
};

/** Metadata describing a tomogram. */
export type Tomogram = EntityInterface & Node & {
  __typename?: 'Tomogram';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  alignment?: Maybe<Alignment>;
  alignmentId?: Maybe<Scalars['Int']['output']>;
  authors: TomogramAuthorConnection;
  authorsAggregate?: Maybe<TomogramAuthorAggregate>;
  /** Whether this tomogram is CTF corrected */
  ctfCorrected?: Maybe<Scalars['Boolean']['output']>;
  deposition?: Maybe<Deposition>;
  depositionId?: Maybe<Scalars['Int']['output']>;
  /** Whether the tomographic alignment was computed based on fiducial markers. */
  fiducialAlignmentStatus: Fiducial_Alignment_Status_Enum;
  /** HTTPS path to this tomogram in MRC format (no scaling) */
  httpsMrcFile?: Maybe<Scalars['String']['output']>;
  /** HTTPS path to this tomogram in multiscale OME-Zarr format */
  httpsOmezarrDir?: Maybe<Scalars['String']['output']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** whether this tomogram is canonical for the run */
  isCanonical?: Maybe<Scalars['Boolean']['output']>;
  /** Whether this tomogram was generated per the portal's standards */
  isStandardized: Scalars['Boolean']['output'];
  /** URL for the thumbnail of key photo */
  keyPhotoThumbnailUrl?: Maybe<Scalars['String']['output']>;
  /** URL for the key photo */
  keyPhotoUrl?: Maybe<Scalars['String']['output']>;
  /** Short name for this tomogram */
  name?: Maybe<Scalars['String']['output']>;
  /** the compact json of neuroglancer config */
  neuroglancerConfig?: Maybe<Scalars['String']['output']>;
  /** x offset data relative to the canonical tomogram in pixels */
  offsetX: Scalars['Int']['output'];
  /** y offset data relative to the canonical tomogram in pixels */
  offsetY: Scalars['Int']['output'];
  /** z offset data relative to the canonical tomogram in pixels */
  offsetZ: Scalars['Int']['output'];
  /** Describe additional processing used to derive the tomogram */
  processing: Tomogram_Processing_Enum;
  /** Processing software used to derive the tomogram */
  processingSoftware?: Maybe<Scalars['String']['output']>;
  /** Describe reconstruction method (WBP, SART, SIRT) */
  reconstructionMethod: Tomogram_Reconstruction_Method_Enum;
  /** Name of software used for reconstruction */
  reconstructionSoftware: Scalars['String']['output'];
  run?: Maybe<Run>;
  runId?: Maybe<Scalars['Int']['output']>;
  /** S3 path to this tomogram in MRC format (no scaling) */
  s3MrcFile?: Maybe<Scalars['String']['output']>;
  /** S3 path to this tomogram in multiscale OME-Zarr format */
  s3OmezarrDir?: Maybe<Scalars['String']['output']>;
  /** comma separated x,y,z dimensions of the unscaled tomogram */
  scale0Dimensions?: Maybe<Scalars['String']['output']>;
  /** comma separated x,y,z dimensions of the scale1 tomogram */
  scale1Dimensions?: Maybe<Scalars['String']['output']>;
  /** comma separated x,y,z dimensions of the scale2 tomogram */
  scale2Dimensions?: Maybe<Scalars['String']['output']>;
  /** Tomogram voxels in the x dimension */
  sizeX: Scalars['Float']['output'];
  /** Tomogram voxels in the y dimension */
  sizeY: Scalars['Float']['output'];
  /** Tomogram voxels in the z dimension */
  sizeZ: Scalars['Float']['output'];
  /** Version of tomogram */
  tomogramVersion?: Maybe<Scalars['Float']['output']>;
  tomogramVoxelSpacing?: Maybe<TomogramVoxelSpacing>;
  tomogramVoxelSpacingId?: Maybe<Scalars['Int']['output']>;
  /** Voxel spacing equal in all three axes in angstroms */
  voxelSpacing: Scalars['Float']['output'];
};


/** Metadata describing a tomogram. */
export type TomogramAlignmentArgs = {
  orderBy?: InputMaybe<Array<AlignmentOrderByClause>>;
  where?: InputMaybe<AlignmentWhereClause>;
};


/** Metadata describing a tomogram. */
export type TomogramAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TomogramAuthorOrderByClause>>;
  where?: InputMaybe<TomogramAuthorWhereClause>;
};


/** Metadata describing a tomogram. */
export type TomogramAuthorsAggregateArgs = {
  where?: InputMaybe<TomogramAuthorWhereClause>;
};


/** Metadata describing a tomogram. */
export type TomogramDepositionArgs = {
  orderBy?: InputMaybe<Array<DepositionOrderByClause>>;
  where?: InputMaybe<DepositionWhereClause>;
};


/** Metadata describing a tomogram. */
export type TomogramRunArgs = {
  orderBy?: InputMaybe<Array<RunOrderByClause>>;
  where?: InputMaybe<RunWhereClause>;
};


/** Metadata describing a tomogram. */
export type TomogramTomogramVoxelSpacingArgs = {
  orderBy?: InputMaybe<Array<TomogramVoxelSpacingOrderByClause>>;
  where?: InputMaybe<TomogramVoxelSpacingWhereClause>;
};

export type TomogramAggregate = {
  __typename?: 'TomogramAggregate';
  aggregate?: Maybe<Array<TomogramAggregateFunctions>>;
};

export type TomogramAggregateFunctions = {
  __typename?: 'TomogramAggregateFunctions';
  avg?: Maybe<TomogramNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<TomogramGroupByOptions>;
  max?: Maybe<TomogramMinMaxColumns>;
  min?: Maybe<TomogramMinMaxColumns>;
  stddev?: Maybe<TomogramNumericalColumns>;
  sum?: Maybe<TomogramNumericalColumns>;
  variance?: Maybe<TomogramNumericalColumns>;
};


export type TomogramAggregateFunctionsCountArgs = {
  columns?: InputMaybe<TomogramCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Author of a tomogram */
export type TomogramAuthor = EntityInterface & Node & {
  __typename?: 'TomogramAuthor';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  /** The address of the author's affiliation. */
  affiliationAddress?: Maybe<Scalars['String']['output']>;
  /** A Research Organization Registry (ROR) identifier. */
  affiliationIdentifier?: Maybe<Scalars['String']['output']>;
  /** The name of the author's affiliation. */
  affiliationName?: Maybe<Scalars['String']['output']>;
  /** The order that the author is listed as in the associated publication */
  authorListOrder: Scalars['Int']['output'];
  /** Whether the author is a corresponding author. */
  correspondingAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
  /** The email address of the author. */
  email?: Maybe<Scalars['String']['output']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  /** The full name of the author. */
  name: Scalars['String']['output'];
  /** The ORCID identifier for the author. */
  orcid?: Maybe<Scalars['String']['output']>;
  /** Whether the author is a primary author. */
  primaryAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
  tomogram?: Maybe<Tomogram>;
  tomogramId?: Maybe<Scalars['Int']['output']>;
};


/** Author of a tomogram */
export type TomogramAuthorTomogramArgs = {
  orderBy?: InputMaybe<Array<TomogramOrderByClause>>;
  where?: InputMaybe<TomogramWhereClause>;
};

export type TomogramAuthorAggregate = {
  __typename?: 'TomogramAuthorAggregate';
  aggregate?: Maybe<Array<TomogramAuthorAggregateFunctions>>;
};

export type TomogramAuthorAggregateFunctions = {
  __typename?: 'TomogramAuthorAggregateFunctions';
  avg?: Maybe<TomogramAuthorNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<TomogramAuthorGroupByOptions>;
  max?: Maybe<TomogramAuthorMinMaxColumns>;
  min?: Maybe<TomogramAuthorMinMaxColumns>;
  stddev?: Maybe<TomogramAuthorNumericalColumns>;
  sum?: Maybe<TomogramAuthorNumericalColumns>;
  variance?: Maybe<TomogramAuthorNumericalColumns>;
};


export type TomogramAuthorAggregateFunctionsCountArgs = {
  columns?: InputMaybe<TomogramAuthorCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type TomogramAuthorConnection = {
  __typename?: 'TomogramAuthorConnection';
  /** Contains the nodes in this connection */
  edges: Array<TomogramAuthorEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum TomogramAuthorCountColumns {
  AffiliationAddress = 'affiliationAddress',
  AffiliationIdentifier = 'affiliationIdentifier',
  AffiliationName = 'affiliationName',
  AuthorListOrder = 'authorListOrder',
  CorrespondingAuthorStatus = 'correspondingAuthorStatus',
  Email = 'email',
  Id = 'id',
  Name = 'name',
  Orcid = 'orcid',
  PrimaryAuthorStatus = 'primaryAuthorStatus',
  Tomogram = 'tomogram'
}

export type TomogramAuthorCreateInput = {
  /** The address of the author's affiliation. */
  affiliationAddress?: InputMaybe<Scalars['String']['input']>;
  /** A Research Organization Registry (ROR) identifier. */
  affiliationIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the author's affiliation. */
  affiliationName?: InputMaybe<Scalars['String']['input']>;
  /** The order that the author is listed as in the associated publication */
  authorListOrder: Scalars['Int']['input'];
  /** Whether the author is a corresponding author. */
  correspondingAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
  /** The email address of the author. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** The full name of the author. */
  name: Scalars['String']['input'];
  /** The ORCID identifier for the author. */
  orcid?: InputMaybe<Scalars['String']['input']>;
  /** Whether the author is a primary author. */
  primaryAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
  /** Metadata describing a tomogram. */
  tomogramId?: InputMaybe<Scalars['ID']['input']>;
};

/** An edge in a connection. */
export type TomogramAuthorEdge = {
  __typename?: 'TomogramAuthorEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: TomogramAuthor;
};

export type TomogramAuthorGroupByOptions = {
  __typename?: 'TomogramAuthorGroupByOptions';
  affiliationAddress?: Maybe<Scalars['String']['output']>;
  affiliationIdentifier?: Maybe<Scalars['String']['output']>;
  affiliationName?: Maybe<Scalars['String']['output']>;
  authorListOrder?: Maybe<Scalars['Int']['output']>;
  correspondingAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  orcid?: Maybe<Scalars['String']['output']>;
  primaryAuthorStatus?: Maybe<Scalars['Boolean']['output']>;
  tomogram?: Maybe<TomogramGroupByOptions>;
};

export type TomogramAuthorMinMaxColumns = {
  __typename?: 'TomogramAuthorMinMaxColumns';
  affiliationAddress?: Maybe<Scalars['String']['output']>;
  affiliationIdentifier?: Maybe<Scalars['String']['output']>;
  affiliationName?: Maybe<Scalars['String']['output']>;
  authorListOrder?: Maybe<Scalars['Int']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  orcid?: Maybe<Scalars['String']['output']>;
};

export type TomogramAuthorNumericalColumns = {
  __typename?: 'TomogramAuthorNumericalColumns';
  authorListOrder?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type TomogramAuthorOrderByClause = {
  affiliationAddress?: InputMaybe<OrderBy>;
  affiliationIdentifier?: InputMaybe<OrderBy>;
  affiliationName?: InputMaybe<OrderBy>;
  authorListOrder?: InputMaybe<OrderBy>;
  correspondingAuthorStatus?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  orcid?: InputMaybe<OrderBy>;
  primaryAuthorStatus?: InputMaybe<OrderBy>;
  tomogram?: InputMaybe<TomogramOrderByClause>;
};

export type TomogramAuthorUpdateInput = {
  /** The address of the author's affiliation. */
  affiliationAddress?: InputMaybe<Scalars['String']['input']>;
  /** A Research Organization Registry (ROR) identifier. */
  affiliationIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the author's affiliation. */
  affiliationName?: InputMaybe<Scalars['String']['input']>;
  /** The order that the author is listed as in the associated publication */
  authorListOrder?: InputMaybe<Scalars['Int']['input']>;
  /** Whether the author is a corresponding author. */
  correspondingAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
  /** The email address of the author. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** The full name of the author. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The ORCID identifier for the author. */
  orcid?: InputMaybe<Scalars['String']['input']>;
  /** Whether the author is a primary author. */
  primaryAuthorStatus?: InputMaybe<Scalars['Boolean']['input']>;
  /** Metadata describing a tomogram. */
  tomogramId?: InputMaybe<Scalars['ID']['input']>;
};

export type TomogramAuthorWhereClause = {
  affiliationAddress?: InputMaybe<StrComparators>;
  affiliationIdentifier?: InputMaybe<StrComparators>;
  affiliationName?: InputMaybe<StrComparators>;
  authorListOrder?: InputMaybe<IntComparators>;
  correspondingAuthorStatus?: InputMaybe<BoolComparators>;
  email?: InputMaybe<StrComparators>;
  id?: InputMaybe<IntComparators>;
  name?: InputMaybe<StrComparators>;
  orcid?: InputMaybe<StrComparators>;
  primaryAuthorStatus?: InputMaybe<BoolComparators>;
  tomogram?: InputMaybe<TomogramWhereClause>;
};

export type TomogramAuthorWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

/** A connection to a list of items. */
export type TomogramConnection = {
  __typename?: 'TomogramConnection';
  /** Contains the nodes in this connection */
  edges: Array<TomogramEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum TomogramCountColumns {
  Alignment = 'alignment',
  Authors = 'authors',
  CtfCorrected = 'ctfCorrected',
  Deposition = 'deposition',
  FiducialAlignmentStatus = 'fiducialAlignmentStatus',
  HttpsMrcFile = 'httpsMrcFile',
  HttpsOmezarrDir = 'httpsOmezarrDir',
  Id = 'id',
  IsCanonical = 'isCanonical',
  IsStandardized = 'isStandardized',
  KeyPhotoThumbnailUrl = 'keyPhotoThumbnailUrl',
  KeyPhotoUrl = 'keyPhotoUrl',
  Name = 'name',
  NeuroglancerConfig = 'neuroglancerConfig',
  OffsetX = 'offsetX',
  OffsetY = 'offsetY',
  OffsetZ = 'offsetZ',
  Processing = 'processing',
  ProcessingSoftware = 'processingSoftware',
  ReconstructionMethod = 'reconstructionMethod',
  ReconstructionSoftware = 'reconstructionSoftware',
  Run = 'run',
  S3MrcFile = 's3MrcFile',
  S3OmezarrDir = 's3OmezarrDir',
  Scale0Dimensions = 'scale0Dimensions',
  Scale1Dimensions = 'scale1Dimensions',
  Scale2Dimensions = 'scale2Dimensions',
  SizeX = 'sizeX',
  SizeY = 'sizeY',
  SizeZ = 'sizeZ',
  TomogramVersion = 'tomogramVersion',
  TomogramVoxelSpacing = 'tomogramVoxelSpacing',
  VoxelSpacing = 'voxelSpacing'
}

export type TomogramCreateInput = {
  /** Tiltseries Alignment */
  alignmentId?: InputMaybe<Scalars['ID']['input']>;
  /** Whether this tomogram is CTF corrected */
  ctfCorrected?: InputMaybe<Scalars['Boolean']['input']>;
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** Whether the tomographic alignment was computed based on fiducial markers. */
  fiducialAlignmentStatus: Fiducial_Alignment_Status_Enum;
  /** HTTPS path to this tomogram in MRC format (no scaling) */
  httpsMrcFile?: InputMaybe<Scalars['String']['input']>;
  /** HTTPS path to this tomogram in multiscale OME-Zarr format */
  httpsOmezarrDir?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  /** whether this tomogram is canonical for the run */
  isCanonical?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether this tomogram was generated per the portal's standards */
  isStandardized: Scalars['Boolean']['input'];
  /** URL for the thumbnail of key photo */
  keyPhotoThumbnailUrl?: InputMaybe<Scalars['String']['input']>;
  /** URL for the key photo */
  keyPhotoUrl?: InputMaybe<Scalars['String']['input']>;
  /** Short name for this tomogram */
  name?: InputMaybe<Scalars['String']['input']>;
  /** the compact json of neuroglancer config */
  neuroglancerConfig?: InputMaybe<Scalars['String']['input']>;
  /** x offset data relative to the canonical tomogram in pixels */
  offsetX: Scalars['Int']['input'];
  /** y offset data relative to the canonical tomogram in pixels */
  offsetY: Scalars['Int']['input'];
  /** z offset data relative to the canonical tomogram in pixels */
  offsetZ: Scalars['Int']['input'];
  /** Describe additional processing used to derive the tomogram */
  processing: Tomogram_Processing_Enum;
  /** Processing software used to derive the tomogram */
  processingSoftware?: InputMaybe<Scalars['String']['input']>;
  /** Describe reconstruction method (WBP, SART, SIRT) */
  reconstructionMethod: Tomogram_Reconstruction_Method_Enum;
  /** Name of software used for reconstruction */
  reconstructionSoftware: Scalars['String']['input'];
  runId?: InputMaybe<Scalars['ID']['input']>;
  /** S3 path to this tomogram in MRC format (no scaling) */
  s3MrcFile?: InputMaybe<Scalars['String']['input']>;
  /** S3 path to this tomogram in multiscale OME-Zarr format */
  s3OmezarrDir?: InputMaybe<Scalars['String']['input']>;
  /** comma separated x,y,z dimensions of the unscaled tomogram */
  scale0Dimensions?: InputMaybe<Scalars['String']['input']>;
  /** comma separated x,y,z dimensions of the scale1 tomogram */
  scale1Dimensions?: InputMaybe<Scalars['String']['input']>;
  /** comma separated x,y,z dimensions of the scale2 tomogram */
  scale2Dimensions?: InputMaybe<Scalars['String']['input']>;
  /** Tomogram voxels in the x dimension */
  sizeX: Scalars['Float']['input'];
  /** Tomogram voxels in the y dimension */
  sizeY: Scalars['Float']['input'];
  /** Tomogram voxels in the z dimension */
  sizeZ: Scalars['Float']['input'];
  /** Version of tomogram */
  tomogramVersion?: InputMaybe<Scalars['Float']['input']>;
  /** Voxel spacings for a run */
  tomogramVoxelSpacingId?: InputMaybe<Scalars['ID']['input']>;
  /** Voxel spacing equal in all three axes in angstroms */
  voxelSpacing: Scalars['Float']['input'];
};

/** An edge in a connection. */
export type TomogramEdge = {
  __typename?: 'TomogramEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Tomogram;
};

export type TomogramGroupByOptions = {
  __typename?: 'TomogramGroupByOptions';
  alignment?: Maybe<AlignmentGroupByOptions>;
  ctfCorrected?: Maybe<Scalars['Boolean']['output']>;
  deposition?: Maybe<DepositionGroupByOptions>;
  fiducialAlignmentStatus?: Maybe<Fiducial_Alignment_Status_Enum>;
  httpsMrcFile?: Maybe<Scalars['String']['output']>;
  httpsOmezarrDir?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  isCanonical?: Maybe<Scalars['Boolean']['output']>;
  isStandardized?: Maybe<Scalars['Boolean']['output']>;
  keyPhotoThumbnailUrl?: Maybe<Scalars['String']['output']>;
  keyPhotoUrl?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  neuroglancerConfig?: Maybe<Scalars['String']['output']>;
  offsetX?: Maybe<Scalars['Int']['output']>;
  offsetY?: Maybe<Scalars['Int']['output']>;
  offsetZ?: Maybe<Scalars['Int']['output']>;
  processing?: Maybe<Tomogram_Processing_Enum>;
  processingSoftware?: Maybe<Scalars['String']['output']>;
  reconstructionMethod?: Maybe<Tomogram_Reconstruction_Method_Enum>;
  reconstructionSoftware?: Maybe<Scalars['String']['output']>;
  run?: Maybe<RunGroupByOptions>;
  s3MrcFile?: Maybe<Scalars['String']['output']>;
  s3OmezarrDir?: Maybe<Scalars['String']['output']>;
  scale0Dimensions?: Maybe<Scalars['String']['output']>;
  scale1Dimensions?: Maybe<Scalars['String']['output']>;
  scale2Dimensions?: Maybe<Scalars['String']['output']>;
  sizeX?: Maybe<Scalars['Float']['output']>;
  sizeY?: Maybe<Scalars['Float']['output']>;
  sizeZ?: Maybe<Scalars['Float']['output']>;
  tomogramVersion?: Maybe<Scalars['Float']['output']>;
  tomogramVoxelSpacing?: Maybe<TomogramVoxelSpacingGroupByOptions>;
  voxelSpacing?: Maybe<Scalars['Float']['output']>;
};

export type TomogramMinMaxColumns = {
  __typename?: 'TomogramMinMaxColumns';
  httpsMrcFile?: Maybe<Scalars['String']['output']>;
  httpsOmezarrDir?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  keyPhotoThumbnailUrl?: Maybe<Scalars['String']['output']>;
  keyPhotoUrl?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  neuroglancerConfig?: Maybe<Scalars['String']['output']>;
  offsetX?: Maybe<Scalars['Int']['output']>;
  offsetY?: Maybe<Scalars['Int']['output']>;
  offsetZ?: Maybe<Scalars['Int']['output']>;
  processingSoftware?: Maybe<Scalars['String']['output']>;
  reconstructionSoftware?: Maybe<Scalars['String']['output']>;
  s3MrcFile?: Maybe<Scalars['String']['output']>;
  s3OmezarrDir?: Maybe<Scalars['String']['output']>;
  scale0Dimensions?: Maybe<Scalars['String']['output']>;
  scale1Dimensions?: Maybe<Scalars['String']['output']>;
  scale2Dimensions?: Maybe<Scalars['String']['output']>;
  sizeX?: Maybe<Scalars['Float']['output']>;
  sizeY?: Maybe<Scalars['Float']['output']>;
  sizeZ?: Maybe<Scalars['Float']['output']>;
  tomogramVersion?: Maybe<Scalars['Float']['output']>;
  voxelSpacing?: Maybe<Scalars['Float']['output']>;
};

export type TomogramNumericalColumns = {
  __typename?: 'TomogramNumericalColumns';
  id?: Maybe<Scalars['Int']['output']>;
  offsetX?: Maybe<Scalars['Int']['output']>;
  offsetY?: Maybe<Scalars['Int']['output']>;
  offsetZ?: Maybe<Scalars['Int']['output']>;
  sizeX?: Maybe<Scalars['Float']['output']>;
  sizeY?: Maybe<Scalars['Float']['output']>;
  sizeZ?: Maybe<Scalars['Float']['output']>;
  tomogramVersion?: Maybe<Scalars['Float']['output']>;
  voxelSpacing?: Maybe<Scalars['Float']['output']>;
};

export type TomogramOrderByClause = {
  alignment?: InputMaybe<AlignmentOrderByClause>;
  ctfCorrected?: InputMaybe<OrderBy>;
  deposition?: InputMaybe<DepositionOrderByClause>;
  fiducialAlignmentStatus?: InputMaybe<OrderBy>;
  httpsMrcFile?: InputMaybe<OrderBy>;
  httpsOmezarrDir?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isCanonical?: InputMaybe<OrderBy>;
  isStandardized?: InputMaybe<OrderBy>;
  keyPhotoThumbnailUrl?: InputMaybe<OrderBy>;
  keyPhotoUrl?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  neuroglancerConfig?: InputMaybe<OrderBy>;
  offsetX?: InputMaybe<OrderBy>;
  offsetY?: InputMaybe<OrderBy>;
  offsetZ?: InputMaybe<OrderBy>;
  processing?: InputMaybe<OrderBy>;
  processingSoftware?: InputMaybe<OrderBy>;
  reconstructionMethod?: InputMaybe<OrderBy>;
  reconstructionSoftware?: InputMaybe<OrderBy>;
  run?: InputMaybe<RunOrderByClause>;
  s3MrcFile?: InputMaybe<OrderBy>;
  s3OmezarrDir?: InputMaybe<OrderBy>;
  scale0Dimensions?: InputMaybe<OrderBy>;
  scale1Dimensions?: InputMaybe<OrderBy>;
  scale2Dimensions?: InputMaybe<OrderBy>;
  sizeX?: InputMaybe<OrderBy>;
  sizeY?: InputMaybe<OrderBy>;
  sizeZ?: InputMaybe<OrderBy>;
  tomogramVersion?: InputMaybe<OrderBy>;
  tomogramVoxelSpacing?: InputMaybe<TomogramVoxelSpacingOrderByClause>;
  voxelSpacing?: InputMaybe<OrderBy>;
};

export type TomogramUpdateInput = {
  /** Tiltseries Alignment */
  alignmentId?: InputMaybe<Scalars['ID']['input']>;
  /** Whether this tomogram is CTF corrected */
  ctfCorrected?: InputMaybe<Scalars['Boolean']['input']>;
  depositionId?: InputMaybe<Scalars['ID']['input']>;
  /** Whether the tomographic alignment was computed based on fiducial markers. */
  fiducialAlignmentStatus?: InputMaybe<Fiducial_Alignment_Status_Enum>;
  /** HTTPS path to this tomogram in MRC format (no scaling) */
  httpsMrcFile?: InputMaybe<Scalars['String']['input']>;
  /** HTTPS path to this tomogram in multiscale OME-Zarr format */
  httpsOmezarrDir?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** whether this tomogram is canonical for the run */
  isCanonical?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether this tomogram was generated per the portal's standards */
  isStandardized?: InputMaybe<Scalars['Boolean']['input']>;
  /** URL for the thumbnail of key photo */
  keyPhotoThumbnailUrl?: InputMaybe<Scalars['String']['input']>;
  /** URL for the key photo */
  keyPhotoUrl?: InputMaybe<Scalars['String']['input']>;
  /** Short name for this tomogram */
  name?: InputMaybe<Scalars['String']['input']>;
  /** the compact json of neuroglancer config */
  neuroglancerConfig?: InputMaybe<Scalars['String']['input']>;
  /** x offset data relative to the canonical tomogram in pixels */
  offsetX?: InputMaybe<Scalars['Int']['input']>;
  /** y offset data relative to the canonical tomogram in pixels */
  offsetY?: InputMaybe<Scalars['Int']['input']>;
  /** z offset data relative to the canonical tomogram in pixels */
  offsetZ?: InputMaybe<Scalars['Int']['input']>;
  /** Describe additional processing used to derive the tomogram */
  processing?: InputMaybe<Tomogram_Processing_Enum>;
  /** Processing software used to derive the tomogram */
  processingSoftware?: InputMaybe<Scalars['String']['input']>;
  /** Describe reconstruction method (WBP, SART, SIRT) */
  reconstructionMethod?: InputMaybe<Tomogram_Reconstruction_Method_Enum>;
  /** Name of software used for reconstruction */
  reconstructionSoftware?: InputMaybe<Scalars['String']['input']>;
  runId?: InputMaybe<Scalars['ID']['input']>;
  /** S3 path to this tomogram in MRC format (no scaling) */
  s3MrcFile?: InputMaybe<Scalars['String']['input']>;
  /** S3 path to this tomogram in multiscale OME-Zarr format */
  s3OmezarrDir?: InputMaybe<Scalars['String']['input']>;
  /** comma separated x,y,z dimensions of the unscaled tomogram */
  scale0Dimensions?: InputMaybe<Scalars['String']['input']>;
  /** comma separated x,y,z dimensions of the scale1 tomogram */
  scale1Dimensions?: InputMaybe<Scalars['String']['input']>;
  /** comma separated x,y,z dimensions of the scale2 tomogram */
  scale2Dimensions?: InputMaybe<Scalars['String']['input']>;
  /** Tomogram voxels in the x dimension */
  sizeX?: InputMaybe<Scalars['Float']['input']>;
  /** Tomogram voxels in the y dimension */
  sizeY?: InputMaybe<Scalars['Float']['input']>;
  /** Tomogram voxels in the z dimension */
  sizeZ?: InputMaybe<Scalars['Float']['input']>;
  /** Version of tomogram */
  tomogramVersion?: InputMaybe<Scalars['Float']['input']>;
  /** Voxel spacings for a run */
  tomogramVoxelSpacingId?: InputMaybe<Scalars['ID']['input']>;
  /** Voxel spacing equal in all three axes in angstroms */
  voxelSpacing?: InputMaybe<Scalars['Float']['input']>;
};

/** Voxel spacings for a run */
export type TomogramVoxelSpacing = EntityInterface & Node & {
  __typename?: 'TomogramVoxelSpacing';
  /** The Globally Unique ID of this object */
  _id: Scalars['GlobalID']['output'];
  annotationFiles: AnnotationFileConnection;
  annotationFilesAggregate?: Maybe<AnnotationFileAggregate>;
  /** Path to a directory containing data for this entity as an HTTPS url */
  httpsPrefix: Scalars['String']['output'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['output'];
  run?: Maybe<Run>;
  runId?: Maybe<Scalars['Int']['output']>;
  /** Path to a directory containing data for this entity as an S3 url */
  s3Prefix: Scalars['String']['output'];
  tomograms: TomogramConnection;
  tomogramsAggregate?: Maybe<TomogramAggregate>;
  /** Voxel spacing equal in all three axes in angstroms */
  voxelSpacing: Scalars['Float']['output'];
};


/** Voxel spacings for a run */
export type TomogramVoxelSpacingAnnotationFilesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AnnotationFileOrderByClause>>;
  where?: InputMaybe<AnnotationFileWhereClause>;
};


/** Voxel spacings for a run */
export type TomogramVoxelSpacingAnnotationFilesAggregateArgs = {
  where?: InputMaybe<AnnotationFileWhereClause>;
};


/** Voxel spacings for a run */
export type TomogramVoxelSpacingRunArgs = {
  orderBy?: InputMaybe<Array<RunOrderByClause>>;
  where?: InputMaybe<RunWhereClause>;
};


/** Voxel spacings for a run */
export type TomogramVoxelSpacingTomogramsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TomogramOrderByClause>>;
  where?: InputMaybe<TomogramWhereClause>;
};


/** Voxel spacings for a run */
export type TomogramVoxelSpacingTomogramsAggregateArgs = {
  where?: InputMaybe<TomogramWhereClause>;
};

export type TomogramVoxelSpacingAggregate = {
  __typename?: 'TomogramVoxelSpacingAggregate';
  aggregate?: Maybe<Array<TomogramVoxelSpacingAggregateFunctions>>;
};

export type TomogramVoxelSpacingAggregateFunctions = {
  __typename?: 'TomogramVoxelSpacingAggregateFunctions';
  avg?: Maybe<TomogramVoxelSpacingNumericalColumns>;
  count?: Maybe<Scalars['Int']['output']>;
  groupBy?: Maybe<TomogramVoxelSpacingGroupByOptions>;
  max?: Maybe<TomogramVoxelSpacingMinMaxColumns>;
  min?: Maybe<TomogramVoxelSpacingMinMaxColumns>;
  stddev?: Maybe<TomogramVoxelSpacingNumericalColumns>;
  sum?: Maybe<TomogramVoxelSpacingNumericalColumns>;
  variance?: Maybe<TomogramVoxelSpacingNumericalColumns>;
};


export type TomogramVoxelSpacingAggregateFunctionsCountArgs = {
  columns?: InputMaybe<TomogramVoxelSpacingCountColumns>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type TomogramVoxelSpacingConnection = {
  __typename?: 'TomogramVoxelSpacingConnection';
  /** Contains the nodes in this connection */
  edges: Array<TomogramVoxelSpacingEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export enum TomogramVoxelSpacingCountColumns {
  AnnotationFiles = 'annotationFiles',
  HttpsPrefix = 'httpsPrefix',
  Id = 'id',
  Run = 'run',
  S3Prefix = 's3Prefix',
  Tomograms = 'tomograms',
  VoxelSpacing = 'voxelSpacing'
}

export type TomogramVoxelSpacingCreateInput = {
  /** Path to a directory containing data for this entity as an HTTPS url */
  httpsPrefix: Scalars['String']['input'];
  /** An identifier to refer to a specific instance of this type */
  id: Scalars['Int']['input'];
  runId?: InputMaybe<Scalars['ID']['input']>;
  /** Path to a directory containing data for this entity as an S3 url */
  s3Prefix: Scalars['String']['input'];
  /** Voxel spacing equal in all three axes in angstroms */
  voxelSpacing: Scalars['Float']['input'];
};

/** An edge in a connection. */
export type TomogramVoxelSpacingEdge = {
  __typename?: 'TomogramVoxelSpacingEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: TomogramVoxelSpacing;
};

export type TomogramVoxelSpacingGroupByOptions = {
  __typename?: 'TomogramVoxelSpacingGroupByOptions';
  httpsPrefix?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  run?: Maybe<RunGroupByOptions>;
  s3Prefix?: Maybe<Scalars['String']['output']>;
  voxelSpacing?: Maybe<Scalars['Float']['output']>;
};

export type TomogramVoxelSpacingMinMaxColumns = {
  __typename?: 'TomogramVoxelSpacingMinMaxColumns';
  httpsPrefix?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  s3Prefix?: Maybe<Scalars['String']['output']>;
  voxelSpacing?: Maybe<Scalars['Float']['output']>;
};

export type TomogramVoxelSpacingNumericalColumns = {
  __typename?: 'TomogramVoxelSpacingNumericalColumns';
  id?: Maybe<Scalars['Int']['output']>;
  voxelSpacing?: Maybe<Scalars['Float']['output']>;
};

export type TomogramVoxelSpacingOrderByClause = {
  httpsPrefix?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  run?: InputMaybe<RunOrderByClause>;
  s3Prefix?: InputMaybe<OrderBy>;
  voxelSpacing?: InputMaybe<OrderBy>;
};

export type TomogramVoxelSpacingUpdateInput = {
  /** Path to a directory containing data for this entity as an HTTPS url */
  httpsPrefix?: InputMaybe<Scalars['String']['input']>;
  /** An identifier to refer to a specific instance of this type */
  id?: InputMaybe<Scalars['Int']['input']>;
  runId?: InputMaybe<Scalars['ID']['input']>;
  /** Path to a directory containing data for this entity as an S3 url */
  s3Prefix?: InputMaybe<Scalars['String']['input']>;
  /** Voxel spacing equal in all three axes in angstroms */
  voxelSpacing?: InputMaybe<Scalars['Float']['input']>;
};

export type TomogramVoxelSpacingWhereClause = {
  annotationFiles?: InputMaybe<AnnotationFileWhereClause>;
  httpsPrefix?: InputMaybe<StrComparators>;
  id?: InputMaybe<IntComparators>;
  run?: InputMaybe<RunWhereClause>;
  s3Prefix?: InputMaybe<StrComparators>;
  tomograms?: InputMaybe<TomogramWhereClause>;
  voxelSpacing?: InputMaybe<FloatComparators>;
};

export type TomogramVoxelSpacingWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type TomogramWhereClause = {
  alignment?: InputMaybe<AlignmentWhereClause>;
  authors?: InputMaybe<TomogramAuthorWhereClause>;
  ctfCorrected?: InputMaybe<BoolComparators>;
  deposition?: InputMaybe<DepositionWhereClause>;
  fiducialAlignmentStatus?: InputMaybe<Fiducial_Alignment_Status_EnumEnumComparators>;
  httpsMrcFile?: InputMaybe<StrComparators>;
  httpsOmezarrDir?: InputMaybe<StrComparators>;
  id?: InputMaybe<IntComparators>;
  isCanonical?: InputMaybe<BoolComparators>;
  isStandardized?: InputMaybe<BoolComparators>;
  keyPhotoThumbnailUrl?: InputMaybe<StrComparators>;
  keyPhotoUrl?: InputMaybe<StrComparators>;
  name?: InputMaybe<StrComparators>;
  neuroglancerConfig?: InputMaybe<StrComparators>;
  offsetX?: InputMaybe<IntComparators>;
  offsetY?: InputMaybe<IntComparators>;
  offsetZ?: InputMaybe<IntComparators>;
  processing?: InputMaybe<Tomogram_Processing_EnumEnumComparators>;
  processingSoftware?: InputMaybe<StrComparators>;
  reconstructionMethod?: InputMaybe<Tomogram_Reconstruction_Method_EnumEnumComparators>;
  reconstructionSoftware?: InputMaybe<StrComparators>;
  run?: InputMaybe<RunWhereClause>;
  s3MrcFile?: InputMaybe<StrComparators>;
  s3OmezarrDir?: InputMaybe<StrComparators>;
  scale0Dimensions?: InputMaybe<StrComparators>;
  scale1Dimensions?: InputMaybe<StrComparators>;
  scale2Dimensions?: InputMaybe<StrComparators>;
  sizeX?: InputMaybe<FloatComparators>;
  sizeY?: InputMaybe<FloatComparators>;
  sizeZ?: InputMaybe<FloatComparators>;
  tomogramVersion?: InputMaybe<FloatComparators>;
  tomogramVoxelSpacing?: InputMaybe<TomogramVoxelSpacingWhereClause>;
  voxelSpacing?: InputMaybe<FloatComparators>;
};

export type TomogramWhereClauseMutations = {
  id?: InputMaybe<IntComparators>;
};

export type Tomogram_Processing_EnumEnumComparators = {
  _eq?: InputMaybe<Tomogram_Processing_Enum>;
  _gt?: InputMaybe<Tomogram_Processing_Enum>;
  _gte?: InputMaybe<Tomogram_Processing_Enum>;
  _in?: InputMaybe<Array<Tomogram_Processing_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Tomogram_Processing_Enum>;
  _lte?: InputMaybe<Tomogram_Processing_Enum>;
  _neq?: InputMaybe<Tomogram_Processing_Enum>;
  _nin?: InputMaybe<Array<Tomogram_Processing_Enum>>;
};

export type Tomogram_Reconstruction_Method_EnumEnumComparators = {
  _eq?: InputMaybe<Tomogram_Reconstruction_Method_Enum>;
  _gt?: InputMaybe<Tomogram_Reconstruction_Method_Enum>;
  _gte?: InputMaybe<Tomogram_Reconstruction_Method_Enum>;
  _in?: InputMaybe<Array<Tomogram_Reconstruction_Method_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Tomogram_Reconstruction_Method_Enum>;
  _lte?: InputMaybe<Tomogram_Reconstruction_Method_Enum>;
  _neq?: InputMaybe<Tomogram_Reconstruction_Method_Enum>;
  _nin?: InputMaybe<Array<Tomogram_Reconstruction_Method_Enum>>;
};

export enum Alignment_Type_Enum {
  Global = 'GLOBAL',
  Local = 'LOCAL'
}

export enum Annotation_File_Shape_Type_Enum {
  InstanceSegmentation = 'InstanceSegmentation',
  Mesh = 'Mesh',
  OrientedPoint = 'OrientedPoint',
  Point = 'Point',
  SegmentationMask = 'SegmentationMask'
}

export enum Annotation_File_Source_Enum {
  Community = 'community',
  DatasetAuthor = 'dataset_author',
  PortalStandard = 'portal_standard'
}

export enum Annotation_Method_Type_Enum {
  Automated = 'automated',
  Hybrid = 'hybrid',
  Manual = 'manual'
}

export enum Deposition_Types_Enum {
  Annotation = 'annotation',
  Dataset = 'dataset',
  Tomogram = 'tomogram'
}

export enum Fiducial_Alignment_Status_Enum {
  Fiducial = 'FIDUCIAL',
  NonFiducial = 'NON_FIDUCIAL'
}

export enum OrderBy {
  Asc = 'asc',
  AscNullsFirst = 'asc_nulls_first',
  AscNullsLast = 'asc_nulls_last',
  Desc = 'desc',
  DescNullsFirst = 'desc_nulls_first',
  DescNullsLast = 'desc_nulls_last'
}

export enum Sample_Type_Enum {
  Cell = 'cell',
  InSilico = 'in_silico',
  InVitro = 'in_vitro',
  Organelle = 'organelle',
  Organism = 'organism',
  Other = 'other',
  Tissue = 'tissue',
  Virus = 'virus'
}

export enum Tiltseries_Microscope_Manufacturer_Enum {
  Fei = 'FEI',
  Jeol = 'JEOL',
  Tfs = 'TFS'
}

export enum Tomogram_Processing_Enum {
  Denoised = 'denoised',
  Filtered = 'filtered',
  Raw = 'raw'
}

export enum Tomogram_Reconstruction_Method_Enum {
  FourierSpace = 'Fourier_Space',
  Sart = 'SART',
  Sirt = 'SIRT',
  Unknown = 'Unknown',
  Wbp = 'WBP'
}

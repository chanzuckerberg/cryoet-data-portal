export const EMPIAR_ID = /EMPIAR-([\d]+)/
export const EMDB_ID = /EMD-([\d]+)/
export const DOI_ID = /(10\..+\/.+)/

export const EMPIAR_URL = 'https://www.ebi.ac.uk/empiar/'
export const EMDB_URL = 'https://www.ebi.ac.uk/emdb/'
export const DOI_URL = 'https://doi.org/'

export const EMPIAR_LABEL = 'EMPIAR ID'
export const EMDB_LABEL = 'EMDB ID'
export const DOI_LABEL = 'DOI'

export enum DatabaseType {
  EMPIAR,
  EMDB,
  DOI,
}

export const REGEX_MAP = new Map([
  [DatabaseType.EMPIAR, EMPIAR_ID],
  [DatabaseType.EMDB, EMDB_ID],
  [DatabaseType.DOI, DOI_ID],
])

export const URL_MAP = new Map([
  [DatabaseType.EMPIAR, EMPIAR_URL],
  [DatabaseType.EMDB, EMDB_URL],
  [DatabaseType.DOI, DOI_URL],
])

export const LABEL_MAP = new Map([
  [DatabaseType.EMPIAR, EMPIAR_LABEL],
  [DatabaseType.EMDB, EMDB_LABEL],
  [DatabaseType.DOI, DOI_LABEL],
])

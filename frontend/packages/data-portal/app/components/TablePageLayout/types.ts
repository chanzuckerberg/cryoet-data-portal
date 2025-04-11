import { ComponentType, ReactNode } from 'react'

export interface TableHeaderProps {
  countLabel: string
  description?: string
  filteredCount: number
  title: string
  totalCount: number
  learnMoreLink?: string
}

export interface TablePageLayoutProps {
  banner?: ReactNode
  header?: ReactNode

  tabs: TableLayoutTab[] // If there is only 1 tab, the tab selector will not show.
  tabsTitle?: string

  downloadModal?: ReactNode
  drawers?: ReactNode
}

export interface TableLayoutTab {
  Header?: ComponentType<TableHeaderProps>
  title: string
  description?: string
  learnMoreLink?: string

  banner?: ReactNode
  filterPanel?: ReactNode

  table: ReactNode
  pageQueryParamKey?: string

  noFilteredResults?: ReactNode
  noTotalResults?: ReactNode

  filteredCount: number
  totalCount: number
  countLabel: string // e.g. "objects" in "1 of 3 objects".
}

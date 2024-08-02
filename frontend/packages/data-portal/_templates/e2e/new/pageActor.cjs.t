---
to: e2e/pageObjects/<%= name %>/<%= name %>Actor.ts
---
/**
 * This file contains combinations of page interactions or data fetching. Remove if not needed.
 */
import { <%= h.changeCase.pascal(name) %>Page } from 'e2e/pageObjects/<%= name %>/<%= name %>Page'

export class <%= h.changeCase.pascal(name) %>Actor {
  private <%= name %>Page: <%= h.changeCase.pascal(name) %>Page

  constructor(<%= name %>Page: <%= h.changeCase.pascal(name) %>Page) {
    this.<%= name %>Page = <%= name %>Page
  }
  // #region Navigate
  // #endregion Navigate

   // #region Click
  // #endregion Click

  // #region Hover
  // #endregion Hover

  // #region Get
  // #endregion Get

  // #region Macro
  // #endregion Macro

  // #region Validation
  // #endregion Validation

  // #region Bool
  // #endregion Bool
}
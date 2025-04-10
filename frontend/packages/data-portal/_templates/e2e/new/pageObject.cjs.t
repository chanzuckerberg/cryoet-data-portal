---
to: e2e/pageObjects/<%= name %>/<%= name %>Page.ts
---
import { expect } from '@chromatic-com/playwright'
import { BasePage } from 'e2e/pageObjects/basePage'

export class <%= h.changeCase.pascal(name) %>Page extends BasePage {
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

import { render, screen } from '@testing-library/react'

import { TomogramTypeBadge } from './TomogramTypeBadge'

const TYPES = ['standard', 'author'] as const

const TYPE_I18N_MAP = {
  standard: 'portalStandard',
  author: 'authorSubmitted',
}

describe('<TomogramTypeBadge />', () => {
  TYPES.forEach((type) => {
    it(`should render correct text for ${type}`, () => {
      render(<TomogramTypeBadge type={type} />)

      expect(screen.queryByText(TYPE_I18N_MAP[type])).toBeVisible()
    })
  })

  it('should show tooltip if defined', () => {
    render(<TomogramTypeBadge type="standard" showTooltip />)

    expect(screen.queryByRole('tooltip')).toBeVisible()
  })
})

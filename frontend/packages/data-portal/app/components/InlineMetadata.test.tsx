import { render, screen } from '@testing-library/react'

import { InlineMetadata, Metadata } from './InlineMetadata'

const TEST_FIELDS: Metadata[] = [
  {
    key: 'key1',
    value: 'value1',
  },
  {
    key: 'key2',
    value: 'value2',
  },
]

describe('<InlineMetadata />', () => {
  it('should render fields', () => {
    render(<InlineMetadata fields={TEST_FIELDS} />)

    TEST_FIELDS.forEach((field) => {
      expect(screen.getByText(`${field.key}:`)).toBeInTheDocument()
      expect(screen.getByText(field.value)).toBeInTheDocument()
    })
  })

  it('should render label if defined', () => {
    const label = 'Test label'
    render(<InlineMetadata label={label} fields={TEST_FIELDS} />)

    expect(screen.getByText(label)).toBeInTheDocument()
  })
})

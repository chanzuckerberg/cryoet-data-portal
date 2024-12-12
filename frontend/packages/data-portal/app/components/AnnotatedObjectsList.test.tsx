import { render, screen } from '@testing-library/react'

import { ANNOTATED_OBJECTS_MAX } from 'app/constants/pagination'

import { AnnotatedObjectsList } from './AnnotatedObjectsList'

function getItems(length: number) {
  return (
    Array(length)
      .fill(null)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map((_, idx) => `test ${idx}`)
  )
}

describe('<AnnotatedObjectsList />', () => {
  it('should render annotated objects', () => {
    const items = getItems(ANNOTATED_OBJECTS_MAX)
    render(<AnnotatedObjectsList annotatedObjects={items} />)
    items.forEach((item) => expect(screen.getByText(item)).toBeVisible())
  })

  it('should render n more objects if list is greater than max', () => {
    const nMoreItems = 3
    const items = getItems(ANNOTATED_OBJECTS_MAX + nMoreItems)
    render(<AnnotatedObjectsList annotatedObjects={items} />)
    expect(screen.queryByText('nMoreObjects')).toBeVisible()
  })
})

import { render, screen } from '@testing-library/react'

import { ANNOTATED_OBJECTS_MAX } from 'app/constants/pagination'

import { AnnotatedObjectsList } from './AnnotatedObjectsList'

function getItems(length: number) {
  return Array(length)
    .fill(null)
    .map((_, idx) => `test ${idx}`)
}

function getMap(length: number, value = true) {
  return getItems(length).reduce((acc, item) => {
    acc.set(item, value)
    return acc
  }, new Map<string, boolean>())
}

describe('<AnnotatedObjectsList />', () => {
  it('should render annotated objects', () => {
    const items = getMap(ANNOTATED_OBJECTS_MAX)
    render(<AnnotatedObjectsList annotatedObjects={items} />)
    items.forEach((_, key) => expect(screen.getByText(key)).toBeVisible())
  })

  it('should render a GT tag if ground truth is true', () => {
    const items = getMap(ANNOTATED_OBJECTS_MAX)
    render(<AnnotatedObjectsList annotatedObjects={items} />)
    items.forEach((_, key) => {
      expect(screen.getByTestId(`${key}-gtTag`)).toBeVisible()
    })
  })

  it('should not render a GT tag if ground truth is false', () => {
    const items = getMap(ANNOTATED_OBJECTS_MAX, false)
    render(<AnnotatedObjectsList annotatedObjects={items} />)
    items.forEach((_, key) => {
      expect(screen.getByTestId(`${key}-gtTag`)).toBeVisible()
    })
  })

  it('should render n more objects if list is greater than max', () => {
    const nMoreItems = 3
    const items = getMap(ANNOTATED_OBJECTS_MAX + nMoreItems)
    render(<AnnotatedObjectsList annotatedObjects={items} />)
    expect(screen.queryByText('nMoreObjects')).toBeVisible()
  })
})

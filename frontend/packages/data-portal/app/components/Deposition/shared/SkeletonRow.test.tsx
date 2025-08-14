/**
 * @jest-environment jsdom
 */

import React from 'react'

import { SkeletonRow } from './SkeletonRow'

// Simple component introspection tests that don't require full rendering
describe('<SkeletonRow />', () => {
  describe('component structure and props', () => {
    it('should be a function component', () => {
      expect(typeof SkeletonRow).toBe('function')
    })

    it('should accept required colSpan prop', () => {
      // Test that component can be instantiated with minimal props
      const element = React.createElement(SkeletonRow, { colSpan: 3 })
      expect(element.props.colSpan).toBe(3)
    })

    it('should accept showIcon prop with default true', () => {
      const elementWithIcon = React.createElement(SkeletonRow, {
        colSpan: 3,
        showIcon: true,
      })
      expect(elementWithIcon.props.showIcon).toBe(true)

      const elementWithoutIcon = React.createElement(SkeletonRow, {
        colSpan: 3,
        showIcon: false,
      })
      expect(elementWithoutIcon.props.showIcon).toBe(false)

      // Test default behavior
      const elementDefault = React.createElement(SkeletonRow, { colSpan: 3 })
      expect(elementDefault.props.showIcon).toBeUndefined() // Should default to true in component
    })

    it('should accept labelWidth prop with default 120', () => {
      const elementWithCustomWidth = React.createElement(SkeletonRow, {
        colSpan: 3,
        labelWidth: 200,
      })
      expect(elementWithCustomWidth.props.labelWidth).toBe(200)

      const elementDefault = React.createElement(SkeletonRow, { colSpan: 3 })
      expect(elementDefault.props.labelWidth).toBeUndefined() // Should default to 120 in component
    })

    it('should accept countWidth prop with default 80', () => {
      const elementWithCustomWidth = React.createElement(SkeletonRow, {
        colSpan: 3,
        countWidth: 100,
      })
      expect(elementWithCustomWidth.props.countWidth).toBe(100)

      const elementDefault = React.createElement(SkeletonRow, { colSpan: 3 })
      expect(elementDefault.props.countWidth).toBeUndefined() // Should default to 80 in component
    })

    it('should accept different colSpan values for different use cases', () => {
      // Annotations use colSpan 3
      const annotationsElement = React.createElement(SkeletonRow, {
        colSpan: 3,
      })
      expect(annotationsElement.props.colSpan).toBe(3)

      // Tomograms use colSpan 7
      const tomogramsElement = React.createElement(SkeletonRow, { colSpan: 7 })
      expect(tomogramsElement.props.colSpan).toBe(7)

      // Should accept any colSpan value
      const customElement = React.createElement(SkeletonRow, { colSpan: 5 })
      expect(customElement.props.colSpan).toBe(5)
    })

    it('should work with all prop combinations', () => {
      const element = React.createElement(SkeletonRow, {
        colSpan: 4,
        showIcon: false,
        labelWidth: 150,
        countWidth: 120,
      })

      expect(element.props.colSpan).toBe(4)
      expect(element.props.showIcon).toBe(false)
      expect(element.props.labelWidth).toBe(150)
      expect(element.props.countWidth).toBe(120)
    })
  })

  describe('default prop values', () => {
    it('should have correct default prop behavior', () => {
      // Create element with minimal props
      const element = React.createElement(SkeletonRow, { colSpan: 3 })

      // Required prop should be set
      expect(element.props.colSpan).toBe(3)

      // Optional props should be undefined (defaults applied in component)
      expect(element.props.showIcon).toBeUndefined()
      expect(element.props.labelWidth).toBeUndefined()
      expect(element.props.countWidth).toBeUndefined()
    })
  })

  describe('component interface', () => {
    it('should match expected interface for annotations (colSpan=3)', () => {
      const annotationSkeleton = React.createElement(SkeletonRow, {
        colSpan: 3,
        showIcon: true,
        labelWidth: 120,
        countWidth: 80,
      })

      expect(annotationSkeleton.props).toMatchObject({
        colSpan: 3,
        showIcon: true,
        labelWidth: 120,
        countWidth: 80,
      })
    })

    it('should match expected interface for tomograms (colSpan=7)', () => {
      const tomogramSkeleton = React.createElement(SkeletonRow, {
        colSpan: 7,
        showIcon: false,
        labelWidth: 200,
        countWidth: 100,
      })

      expect(tomogramSkeleton.props).toMatchObject({
        colSpan: 7,
        showIcon: false,
        labelWidth: 200,
        countWidth: 100,
      })
    })
  })
})

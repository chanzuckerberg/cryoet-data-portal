import { Button, IconNameToSizes } from '@czi-sds/components'
import { ReactElement, useEffect, useState } from 'react'

import { cns } from 'app/utils/cns'

const getButtonClasses = (direction: 'left' | 'right') =>
  cns(
    direction === 'right' ? '[&_svg]:left-[1px]' : '[&_svg]:right-[1px]',
    '[&_svg]:relative [&_svg]:fill-[#6C6C6C]',
    '[&&]:disabled:bg-[#DFDFDF] [&_svg]:disabled:fill-[#C3C3C3]',
    '[&_svg]:hover:fill-[#0041B9] [&&]:hover:bg-light-sds-color-primitive-gray-100',
    '[&&]:bg-white rounded-full shadow-[0px_2px_4px_0px_#0000001F]',
    'transition',
  )

export function Carousel({
  totalCards,
  leftIcon,
  rightIcon,
  gap,
  numberOfVisibleCards,
  totalWidth,
  children,
}: {
  totalCards: number
  leftIcon?: keyof IconNameToSizes | ReactElement
  rightIcon?: keyof IconNameToSizes | ReactElement
  gap: number
  numberOfVisibleCards: number
  totalWidth: number
  children: Array<ReactElement>
}) {
  const [carouselPosition, setCarouselPosition] = useState<number>(1)
  const incompleteLastSlideCardNum = totalCards % numberOfVisibleCards
  const numberOfSlides = Math.ceil(totalCards / numberOfVisibleCards)
  const numberOfSlidesArray = [...Array(numberOfSlides).keys()]
  const cardWidth =
    (totalWidth - (numberOfVisibleCards - 1) * gap) / numberOfVisibleCards

  const getCarouselOffset = ({ position }: { position: number }) => {
    // if it is not the last slide or if the last slide has the full amount of visible cards
    const getPreviousSlidesWidth = (includeLastSlide: boolean) => {
      const totalSlidesWidth =
        totalWidth * (position - (includeLastSlide ? 1 : 2)) +
        gap * (position - (includeLastSlide ? 1 : 2))
      // We add an extra gap to center the carousel within the viewport after including box shadows
      return totalSlidesWidth
    }

    if (position !== numberOfSlides || incompleteLastSlideCardNum === 0) {
      return getPreviousSlidesWidth(true)
    }
    // If the last slide has less than the total possible numberOfVisibleCards
    const offset = getPreviousSlidesWidth(false)
    const offsetLastSlide = (cardWidth + gap) * incompleteLastSlideCardNum
    return offset + offsetLastSlide
  }

  useEffect(() => {
    if (carouselPosition > numberOfSlides) {
      setCarouselPosition(1)
    }
  }, [carouselPosition, numberOfSlides])

  const changeCarouselPosition = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCarouselPosition((prev) => {
        if (prev === 1) {
          return prev
        }
        return prev - 1
      })
    } else {
      setCarouselPosition((prev) => {
        if (prev === numberOfSlides) {
          return prev
        }
        return prev + 1
      })
    }
  }
  return (
    <div>
      <div className="overflow-x-clip w-[calc(100%+40px)] translate-x-[-20px]">
        <div
          style={{
            right: `${getCarouselOffset({ position: carouselPosition })}px`,
            gridTemplateColumns: `repeat(${totalCards}, ${cardWidth}px)`,
          }}
          className={cns(
            'grid gap-sds-xxl',
            'translate-x-[20px] relative',
            'transition-all duration-600 ease-in-out',
          )}
        >
          {children}
        </div>
      </div>
      <div className="flex justify-center mt-sds-xxl items-center gap-sds-xl">
        <Button
          sdsType="primary"
          sdsStyle="icon"
          icon={leftIcon ?? 'ChevronLeft'}
          sdsSize="small"
          onClick={() => changeCarouselPosition('left')}
          disabled={carouselPosition === 1}
          className={getButtonClasses('left')}
        />
        <div
          style={{
            gridTemplateColumns: `repeat(${numberOfSlides}, ${
              // if the number of slides is greater than 4, we want to reduce the size of the dots to 20px
              numberOfSlides > 4 ? 20 : 45
            }px)`,
          }}
          className={`grid grid-cols-${numberOfSlides} gap-sds-s grid-rows-[4px]`}
        >
          {numberOfSlidesArray.map((_, index) => (
            <button
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              onClick={() => setCarouselPosition(index + 1)}
              type="button"
              aria-label={`Go to Carousel Slide ${index + 1}`}
              disabled={index === carouselPosition - 1}
              className={cns(
                'rounded-full h-full',
                'bg-light-sds-color-primitive-gray-200',
                index !== carouselPosition - 1 &&
                  'hover:bg-light-sds-color-primitive-gray-300',
                index === carouselPosition - 1
                  ? 'bg-sds-color-semantic-component-accent-icon'
                  : 'bg-light-sds-color-primitive-gray-200',
              )}
            />
          ))}
        </div>
        <Button
          sdsType="primary"
          sdsStyle="icon"
          icon={rightIcon ?? 'ChevronRight'}
          sdsSize="small"
          onClick={() => changeCarouselPosition('right')}
          disabled={carouselPosition === numberOfSlides}
          className={getButtonClasses('right')}
        />
      </div>
    </div>
  )
}

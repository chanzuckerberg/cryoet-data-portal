import { Button } from '@czi-sds/components'
import { useState } from 'react'

import { useWindowSize } from 'app/hooks/useWindowSize'
import { cns } from 'app/utils/cns'

import { Winner, WinnerCard } from '../WinnerCard/WinnerCard'

export function OtherWinners({ winners }: { winners: Winner[] }) {
  const [carouselPosition, setCarouselPosition] = useState<number>(1)
  const winnersLength = winners.length - 3
  const gap = 40
  const size = useWindowSize()
  const numberOfVisibleCards =
    // eslint-disable-next-line no-nested-ternary
    size?.width && size.width <= 667
      ? 1
      : size?.width && size.width <= 1345
      ? 2
      : 3

  const totalWidth =
    // eslint-disable-next-line no-nested-ternary
    size?.width && size.width <= 1024
      ? size.width - 48 // 48 is for the padding of the parent container
      : size?.width && size.width < 1345
      ? 800
      : 1100

  const incompleteLastSlideCardNum = winnersLength % numberOfVisibleCards
  const numberOfSlides = Math.ceil(winnersLength / numberOfVisibleCards)
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

  // console.table({
  //   cardWidth,
  //   totalWidth,
  //   numberOfSlides,
  //   numberOfVisibleCards,
  //   gap,
  //   incompleteLastSlideCardNum,
  //   getCarouselOffset: getCarouselOffset({ position: carouselPosition }),
  // })

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
            gridTemplateColumns: `repeat(${winnersLength}, ${cardWidth}px)`,
          }}
          className={cns(
            'grid gap-sds-xxl',
            'translate-x-[20px] relative',
            'transition-all duration-600 ease-in-out',
          )}
        >
          {winners.map(
            (winner, index) =>
              index > 2 && (
                <WinnerCard
                  winner={winner}
                  key={winner.name}
                  place={index + 1}
                />
              ),
          )}
        </div>
      </div>
      <div className="flex justify-center mt-sds-xxl items-center gap-sds-xl">
        <Button
          sdsType="primary"
          sdsStyle="icon"
          icon="ChevronLeft"
          sdsSize="small"
          onClick={() => changeCarouselPosition('left')}
          disabled={carouselPosition === 1}
        />
        <div
          style={{
            gridTemplateColumns: `repeat(${numberOfSlides}, ${
              numberOfSlides > 4 ? 20 : 45
            }px)`,
          }}
          className={`grid grid-cols-${numberOfSlides} gap-sds-s grid-rows-[4px]`}
        >
          {numberOfSlidesArray.map((_, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={`
                  rounded-full
                  h-full
                  bg-sds-color-primitive-gray-200
                  ${
                    index === carouselPosition - 1
                      ? 'bg-sds-color-semantic-component-accent-icon'
                      : 'bg-sds-color-primitive-gray-200'
                  }
                `}
            />
          ))}
        </div>
        <Button
          sdsType="primary"
          sdsStyle="icon"
          icon="ChevronRight"
          sdsSize="small"
          onClick={() => changeCarouselPosition('right')}
          disabled={carouselPosition === numberOfSlides}
        />
      </div>
    </div>
  )
}

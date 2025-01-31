import { Button } from '@czi-sds/components'
import { useState } from 'react'

import { cns } from 'app/utils/cns'

import { Winner, WinnerCard } from '../WinnerCard/WinnerCard'

export function OtherWinners({ winners }: { winners: Winner[] }) {
  const [caroselPosition, setCaroselPosition] = useState(1)
  const numberOfVisibleCards = 3
  // const slidesLeftOver = winners.length % numberOfVisibleCards
  const numberOfSlides =
    Math.floor(winners.length / numberOfVisibleCards) +
    (winners.length % numberOfVisibleCards ? 1 : 0)
  // console.log('numberOfSlides', numberOfSlides)
  const changeCaroselPosition = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCaroselPosition((prev) => {
        if (prev === 1) {
          return prev
        }
        return prev - 1
      })
    } else {
      setCaroselPosition((prev) => {
        if (prev === numberOfSlides) {
          return prev
        }
        return prev + 1
      })
    }
  }

  const numberOfSlidesArray = [...Array(numberOfSlides).keys()]

  // width of each card is 340px (at this breakpoint)
  // gap between each card is 40px
  // number of cards visible at a time is 3

  // const cardAndGapWidth = 340 + 40
  // const
  // const numberOfNotVisibleCards = winners.length - ( numberOfVisibleCards
  // const offsetCarosel = numberOfNotVisibleCards * 340 + 40
  return (
    <div>
      <div className="overflow-x-clip w-[calc(100%+40px)] translate-x-[-20px]">
        <div
          className={cns(
            'grid grid-cols-[repeat(7,_340px)] gap-sds-xxl',
            'translate-x-[20px] relative',
            'transition-all duration-600 ease-in-out',
            caroselPosition === 1 && 'right-[0px]',
            caroselPosition === 2 && 'right-[1140px]',
            caroselPosition === 3 && 'right-[1520px]',
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
          onClick={() => changeCaroselPosition('left')}
          disabled={caroselPosition === 1}
        />
        <div className="grid grid-cols-3 gap-sds-s grid-rows-[4px]">
          {numberOfSlidesArray.map((_, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={`
                  rounded-full
                  w-[45px]
                  h-full
                  bg-sds-color-primitive-gray-200
                  ${
                    index === caroselPosition - 1
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
          onClick={() => changeCaroselPosition('right')}
          disabled={caroselPosition === numberOfSlides}
        />
      </div>
    </div>
  )
}

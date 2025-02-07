import { useResizeObserver } from 'app/hooks/useResizeObserver'

import { Winner, WinnerCard } from '../WinnerCard/WinnerCard'
import { Carousel } from './components/Carousel'

export function OtherWinners({ winners }: { winners: Winner[] }) {
  const otherWinners = winners.slice(3)
  const [ref, dimensions] = useResizeObserver()
  const width = dimensions?.width || 0

  const numberOfVisibleCards =
    // eslint-disable-next-line no-nested-ternary
    width < 667 ? 1 : width < 1100 ? 2 : 3

  return (
    <div ref={ref}>
      <Carousel
        gap={40}
        totalCards={otherWinners.length}
        totalWidth={width}
        numberOfVisibleCards={numberOfVisibleCards}
      >
        {otherWinners.map((winner, index) => (
          <WinnerCard winner={winner} key={winner.title} place={index + 4} /> // 4 is the index of the first other winner
        ))}
      </Carousel>
    </div>
  )
}

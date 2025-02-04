import { useWindowSize } from 'app/hooks/useWindowSize'

import { Winner, WinnerCard } from '../WinnerCard/WinnerCard'
import { Carousel } from './components/Carousel'

export function OtherWinners({ winners }: { winners: Winner[] }) {
  const otherWinners = winners.slice(3)
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

  return (
    <>
      <Carousel
        gap={40}
        totalCards={otherWinners.length}
        totalWidth={totalWidth}
        numberOfVisibleCards={numberOfVisibleCards}
      >
        {otherWinners.map((winner, index) => (
          <WinnerCard winner={winner} key={winner.name} place={index + 4} /> // 4 is the index of the first other winner
        ))}
      </Carousel>
    </>
  )
}

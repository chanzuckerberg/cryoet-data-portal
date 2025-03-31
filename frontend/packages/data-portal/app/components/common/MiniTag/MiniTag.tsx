import { ReactNode } from 'react'

export function MiniTag({ children }: { children: ReactNode }) {
  return (
    <span className="h-18 w-18 text-[10px] text-[#0041B9] bg-[#E2EEFF] rounded-full px-[2.5px] py-[3px] tracking-[-0.3px] !font-[400]">
      {children}
    </span>
  )
}

import { ReactNode } from 'react'

export function MdxClass({ children }: { children: ReactNode }) {
  return <span className="token class-name">{children}</span>
}

export function MdxFunction({ children }: { children: ReactNode }) {
  return <span className="token function">{children}</span>
}

export function MdxOperator({ children }: { children: ReactNode }) {
  return <span className="token operator">{children}</span>
}

export function MdxPunctuation({ children }: { children: ReactNode }) {
  return <span className="token punctuation">{children}</span>
}

export function MdxString({ children }: { children: ReactNode }) {
  return <span className="token string">{children}</span>
}

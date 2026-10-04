import type { ReactNode } from 'react'

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col md:flex-none md:rounded-[2.5rem] md:border-[10px] md:border-ink md:bg-ink md:shadow-2xl">
      <div className="hidden items-center justify-center py-2 md:flex" aria-hidden="true">
        <div className="h-5 w-24 rounded-full bg-black" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-paper md:min-h-[740px] md:flex-none md:rounded-[1.8rem]">
        {children}
      </div>
    </div>
  )
}

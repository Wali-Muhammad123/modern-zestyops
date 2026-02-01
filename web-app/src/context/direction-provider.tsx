import { createContext, useContext, useEffect, useState } from 'react'
import { DirectionProvider as RdxDirProvider } from '@radix-ui/react-direction'

export type Direction = 'ltr' | 'rtl'

const DEFAULT_DIRECTION = 'ltr'
const DIRECTION_COOKIE_NAME = 'dir'
const DIRECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

type DirectionContextType = {
  defaultDir: Direction
  dir: Direction
  setDir: (dir: Direction) => void
  resetDir: () => void
}

const DirectionContext = createContext<DirectionContextType | null>(null)

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [dir, _setDir] = useState<Direction>(() => {
    // Direct cookie access
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith(`${DIRECTION_COOKIE_NAME}=`))?.split('=')[1]
    return (cookieValue as Direction) || DEFAULT_DIRECTION
  })

  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute('dir', dir)
  }, [dir])

  const setDir = (dir: Direction) => {
    _setDir(dir)
    // Set cookie directly
    const expires = new Date()
    expires.setTime(expires.getTime() + DIRECTION_COOKIE_MAX_AGE * 1000)
    document.cookie = `${DIRECTION_COOKIE_NAME}=${dir};expires=${expires.toUTCString()};path=/`
  }

  const resetDir = () => {
    _setDir(DEFAULT_DIRECTION)
    // Remove cookie
    document.cookie = `${DIRECTION_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  }

  return (
    <DirectionContext
      value={{
        defaultDir: DEFAULT_DIRECTION,
        dir,
        setDir,
        resetDir,
      }}
    >
      <RdxDirProvider dir={dir}>{children}</RdxDirProvider>
    </DirectionContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDirection() {
  const context = useContext(DirectionContext)
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider')
  }
  return context
}

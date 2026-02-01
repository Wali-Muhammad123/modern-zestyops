import { createContext, useContext, useEffect, useState } from 'react'
import { fonts } from '@/config/fonts'

type Font = (typeof fonts)[number]

const FONT_COOKIE_NAME = 'font'
const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

type FontContextType = {
  font: Font
  setFont: (font: Font) => void
  resetFont: () => void
}

const FontContext = createContext<FontContextType | null>(null)

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, _setFont] = useState<Font>(() => {
    // Direct cookie access
    const savedFont = document.cookie.split('; ').find(row => row.startsWith(`${FONT_COOKIE_NAME}=`))?.split('=')[1]
    return fonts.includes(savedFont as Font) ? (savedFont as Font) : fonts[0]
  })

  useEffect(() => {
    const applyFont = (font: string) => {
      const root = document.documentElement
      root.classList.forEach((cls) => {
        if (cls.startsWith('font-')) root.classList.remove(cls)
      })
      root.classList.add(`font-${font}`)
    }

    applyFont(font)
  }, [font])

  const setFont = (font: Font) => {
    // Set cookie directly
    const expires = new Date()
    expires.setTime(expires.getTime() + FONT_COOKIE_MAX_AGE * 1000)
    document.cookie = `${FONT_COOKIE_NAME}=${font};expires=${expires.toUTCString()};path=/`
    _setFont(font)
  }

  const resetFont = () => {
    // Remove cookie
    document.cookie = `${FONT_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    _setFont(fonts[0])
  }

  return (
    <FontContext value={{ font, setFont, resetFont }}>{children}</FontContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFont = () => {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error('useFont must be used within a FontProvider')
  }
  return context
}

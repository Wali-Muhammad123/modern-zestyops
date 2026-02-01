import { createContext, useContext, useState } from 'react'

export type Collapsible = 'offcanvas' | 'icon' | 'none'
export type Variant = 'inset' | 'sidebar' | 'floating'

// Cookie constants following the pattern from sidebar.tsx
const LAYOUT_COLLAPSIBLE_COOKIE_NAME = 'layout_collapsible'
const LAYOUT_VARIANT_COOKIE_NAME = 'layout_variant'
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Default values
const DEFAULT_VARIANT = 'inset'
const DEFAULT_COLLAPSIBLE = 'icon'

type LayoutContextType = {
  resetLayout: () => void

  defaultCollapsible: Collapsible
  collapsible: Collapsible
  setCollapsible: (collapsible: Collapsible) => void

  defaultVariant: Variant
  variant: Variant
  setVariant: (variant: Variant) => void
}

const LayoutContext = createContext<LayoutContextType | null>(null)

type LayoutProviderProps = {
  children: React.ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [collapsible, _setCollapsible] = useState<Collapsible>(() => {
    // Direct cookie access
    const saved = document.cookie.split('; ').find(row => row.startsWith(`${LAYOUT_COLLAPSIBLE_COOKIE_NAME}=`))?.split('=')[1]
    return (saved as Collapsible) || DEFAULT_COLLAPSIBLE
  })

  const [variant, _setVariant] = useState<Variant>(() => {
    // Direct cookie access
    const saved = document.cookie.split('; ').find(row => row.startsWith(`${LAYOUT_VARIANT_COOKIE_NAME}=`))?.split('=')[1]
    return (saved as Variant) || DEFAULT_VARIANT
  })

  const setCollapsible = (newCollapsible: Collapsible) => {
    _setCollapsible(newCollapsible)
    // Set cookie directly
    const expires = new Date()
    expires.setTime(expires.getTime() + LAYOUT_COOKIE_MAX_AGE * 1000)
    document.cookie = `${LAYOUT_COLLAPSIBLE_COOKIE_NAME}=${newCollapsible};expires=${expires.toUTCString()};path=/`
  }

  const setVariant = (newVariant: Variant) => {
    _setVariant(newVariant)
    // Set cookie directly
    const expires = new Date()
    expires.setTime(expires.getTime() + LAYOUT_COOKIE_MAX_AGE * 1000)
    document.cookie = `${LAYOUT_VARIANT_COOKIE_NAME}=${newVariant};expires=${expires.toUTCString()};path=/`
  }

  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE)
    setVariant(DEFAULT_VARIANT)
  }

  const contextValue: LayoutContextType = {
    resetLayout,
    defaultCollapsible: DEFAULT_COLLAPSIBLE,
    collapsible,
    setCollapsible,
    defaultVariant: DEFAULT_VARIANT,
    variant,
    setVariant,
  }

  return <LayoutContext value={contextValue}>{children}</LayoutContext>
}

// Define the hook for the provider
// eslint-disable-next-line react-refresh/only-export-components
export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}

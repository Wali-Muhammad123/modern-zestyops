import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'CZ', label: 'Czech' },
  { code: 'DE', label: 'German' },
]

export const LanguageSelectDropDown = () => {
  const [selectedLang, setSelectedLang] = useState('EN')

  // Load saved language from localStorage (optional)
  useEffect(() => {
    const savedLang = localStorage.getItem('language')
    if (savedLang) setSelectedLang(savedLang)
  }, [])

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode)
    localStorage.setItem('language', langCode)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="capitalize">
          {selectedLang}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={selectedLang === lang.code ? 'font-semibold' : ''}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


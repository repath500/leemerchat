import React, { createContext, useState, useContext, useEffect } from 'react'

type DarkModeContextType = {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for system preference or stored preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    const storedMode = localStorage.getItem('darkMode')
    
    // Priority: stored preference > system preference
    const initialMode = storedMode 
      ? JSON.parse(storedMode) 
      : prefersDarkMode

    setIsDarkMode(initialMode)
    document.documentElement.classList.toggle('dark', initialMode)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('darkMode', JSON.stringify(newMode))
    document.documentElement.classList.toggle('dark', newMode)
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export const useDarkMode = () => {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}

import React, { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const s = localStorage.getItem('chemini-theme')
    return s ? s === 'dark' : !window.matchMedia('(prefers-color-scheme: light)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.remove('light')
    } else {
      root.classList.add('light')
    }
    localStorage.setItem('chemini-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <Ctx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </Ctx.Provider>
  )
}

export const useTheme = () => useContext(Ctx)

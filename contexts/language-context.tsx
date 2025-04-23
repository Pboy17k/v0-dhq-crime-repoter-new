"use client"

import { useContext } from "react"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { translations } from "@/lib/translations"

type Language = "en" | "ha" | "yo" | "ig"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage) {
        setLanguage(savedLanguage)
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("language", language)
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }, [language])

  const t = (key: string): string => {
    try {
      const keys = key.split(".")
      let value: any = translations[language]

      for (const k of keys) {
        if (value && value[k]) {
          value = value[k]
        } else {
          // If translation is missing, fall back to English
          let fallback = translations["en"]
          for (const k of keys) {
            if (fallback && fallback[k]) {
              fallback = fallback[k]
            } else {
              return key // If even English translation is missing, return the key
            }
          }
          return fallback
        }
      }

      return value
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error)
      return key
    }
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

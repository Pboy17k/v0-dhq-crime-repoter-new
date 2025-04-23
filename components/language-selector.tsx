"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "../hooks/use-language"
import { GlobeIcon } from "lucide-react"

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <GlobeIcon className="h-4 w-4" />
          <span className="sr-only">{t("languageSelector.label")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-muted" : ""}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("ha")} className={language === "ha" ? "bg-muted" : ""}>
          Hausa
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("yo")} className={language === "yo" ? "bg-muted" : ""}>
          Yoruba
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("ig")} className={language === "ig" ? "bg-muted" : ""}>
          Igbo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

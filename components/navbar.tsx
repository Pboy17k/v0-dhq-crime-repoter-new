"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/hooks/use-language"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()

  const routes = [
    {
      href: "/",
      label: t("home"),
      active: pathname === "/",
    },
    {
      href: "/report",
      label: t("report"),
      active: pathname === "/report",
    },
    {
      href: "/map",
      label: t("map"),
      active: pathname === "/map",
    },
    {
      href: "/about",
      label: t("about"),
      active: pathname === "/about",
    },
    {
      href: "/resources",
      label: t("resources"),
      active: pathname === "/resources",
    },
    {
      href: "/contact",
      label: t("contact"),
      active: pathname === "/contact",
    },
  ]

  // Function to capitalize first letter
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="dhq-logo-icon" style={{ width: "30px", height: "30px" }}>
              <div className="dhq-logo-segment dhq-logo-army"></div>
              <div className="dhq-logo-segment dhq-logo-navy"></div>
              <div className="dhq-logo-segment dhq-logo-airforce"></div>
            </div>
            <span className="hidden font-bold sm:inline-block">DHQ Crime Reporter</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route, i) => (
              <Link
                key={i}
                href={route.href}
                className={`transition-colors hover:text-foreground/80 ${
                  route.active ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {capitalize(route.label)}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden" aria-label="Toggle Menu">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileLink href="/" className="flex items-center" onOpenChange={setIsOpen}>
              <div className="dhq-logo-icon mr-2" style={{ width: "30px", height: "30px" }}>
                <div className="dhq-logo-segment dhq-logo-army"></div>
                <div className="dhq-logo-segment dhq-logo-navy"></div>
                <div className="dhq-logo-segment dhq-logo-airforce"></div>
              </div>
              <span className="font-bold">DHQ Crime Reporter</span>
            </MobileLink>
            <div className="flex flex-col space-y-3 pt-6">
              {routes.map((route, i) => (
                <MobileLink
                  key={i}
                  href={route.href}
                  onOpenChange={setIsOpen}
                  className={route.active ? "text-foreground font-medium" : "text-foreground/60"}
                >
                  {capitalize(route.label)}
                </MobileLink>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-6">
              <MobileLink
                href="/admin/login"
                onOpenChange={setIsOpen}
                className="text-foreground/60 hover:text-foreground"
              >
                {capitalize(t("adminLogin"))}
              </MobileLink>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
          <div className="dhq-logo-icon" style={{ width: "24px", height: "24px" }}>
            <div className="dhq-logo-segment dhq-logo-army"></div>
            <div className="dhq-logo-segment dhq-logo-navy"></div>
            <div className="dhq-logo-segment dhq-logo-airforce"></div>
          </div>
          <span className="font-bold">DHQ</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            <LanguageSelector />
            <ModeToggle />
            <Link href="/admin/login">
              <Button variant="ghost" size="sm" className="px-2">
                {capitalize(t("adminLogin"))}
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

interface MobileLinkProps {
  href: string
  onOpenChange?: (open: boolean) => void
  className?: string
  children: React.ReactNode
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false)
      }}
      className={`${className} ${isActive ? "text-foreground" : "text-foreground/60"}`}
      {...props}
    >
      {children}
    </Link>
  )
}

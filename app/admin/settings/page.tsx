"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { useLanguage } from "@/hooks/use-language"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()

  const [defaultTheme, setDefaultTheme] = useState(theme || "system")
  const [defaultLanguage, setDefaultLanguage] = useState(language)
  const [autoBackup, setAutoBackup] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    try {
      const savedSettings = localStorage.getItem("dhq-admin-settings")
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setAutoBackup(settings.autoBackup ?? true)
        setNotificationsEnabled(settings.notificationsEnabled ?? true)
      }

      // Set default theme from system
      if (theme) {
        setDefaultTheme(theme)
      }

      // Set default language
      setDefaultLanguage(language)

      setSettingsLoaded(true)
    } catch (error) {
      console.error("Error parsing settings:", error)
      setSettingsLoaded(true)
    }
  }, [theme, language])

  // Apply theme immediately when changed
  const handleThemeChange = (newTheme: string) => {
    setDefaultTheme(newTheme)
    setTheme(newTheme)
  }

  // Apply language immediately when changed
  const handleLanguageChange = (newLanguage: string) => {
    setDefaultLanguage(newLanguage)
    setLanguage(newLanguage as "en" | "ha" | "yo" | "ig")
  }

  const saveSettings = () => {
    // Save theme and language to their respective contexts
    setTheme(defaultTheme)
    setLanguage(defaultLanguage as "en" | "ha" | "yo" | "ig")

    // Save other settings to localStorage
    localStorage.setItem(
      "dhq-admin-settings",
      JSON.stringify({
        autoBackup,
        notificationsEnabled,
      }),
    )

    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    })
  }

  const clearAllData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      // Clear all data from localStorage except admin auth
      const authData = localStorage.getItem("dhq-admin-auth")
      localStorage.clear()
      if (authData) localStorage.setItem("dhq-admin-auth", authData)

      toast({
        title: "Data cleared",
        description: "All application data has been reset",
      })

      // Reload the page to reset the app state
      window.location.reload()
    }
  }

  if (!settingsLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage application preferences and data</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Default Theme</Label>
              <RadioGroup value={defaultTheme} onValueChange={handleThemeChange} className="grid grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                  <Label
                    htmlFor="theme-light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-2 h-6 w-6"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="m4.93 4.93 1.41 1.41" />
                      <path d="m17.66 17.66 1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="m6.34 17.66-1.41 1.41" />
                      <path d="m19.07 4.93-1.41 1.41" />
                    </svg>
                    Light
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                  <Label
                    htmlFor="theme-dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-2 h-6 w-6"
                    >
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                    Dark
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                  <Label
                    htmlFor="theme-system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-2 h-6 w-6"
                    >
                      <rect width="20" height="14" x="2" y="3" rx="2" />
                      <line x1="8" x2="16" y1="21" y2="21" />
                      <line x1="12" x2="12" y1="17" y2="21" />
                    </svg>
                    System
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Default Language</Label>
              <Select value={defaultLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ha">Hausa</SelectItem>
                  <SelectItem value="yo">Yoruba</SelectItem>
                  <SelectItem value="ig">Igbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
            <CardDescription>Configure system behavior and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="auto-backup" className="flex flex-col space-y-1">
                <span>Automatic Data Backup</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Periodically save data to localStorage
                </span>
              </Label>
              <Switch id="auto-backup" checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="notifications" className="flex flex-col space-y-1">
                <span>Enable Notifications</span>
                <span className="font-normal text-sm text-muted-foreground">Show notifications for new reports</span>
              </Label>
              <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage application data and storage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Clear all application data including crime reports, user preferences, and settings. This action cannot be
              undone.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={clearAllData}>
              Clear All Data
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Save Changes</CardTitle>
            <CardDescription>Apply your configuration changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the button below to save all your settings. Changes will be applied immediately.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSettings}>Save Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

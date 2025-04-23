"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication (in a real app, this would be an API call)
    setTimeout(() => {
      // For demo purposes, accept any non-empty username/password
      if (username && password) {
        // Store admin auth state in localStorage
        localStorage.setItem(
          "dhq-admin-auth",
          JSON.stringify({
            isAuthenticated: true,
            username,
            role: "admin",
            loginTime: new Date().toISOString(),
          }),
        )

        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        })

        router.push("/admin/dashboard")
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Please enter valid credentials",
        })
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12">
      <Card className="w-full max-w-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="dhq-logo-icon" style={{ width: "60px", height: "60px" }}>
              <div className="dhq-logo-segment dhq-logo-army"></div>
              <div className="dhq-logo-segment dhq-logo-navy"></div>
              <div className="dhq-logo-segment dhq-logo-airforce"></div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">DHQ Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="h-auto p-0 text-xs">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-primary/20 focus:border-primary"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            <span>Return to </span>
            <a href="/" className="text-primary hover:underline">
              public site
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

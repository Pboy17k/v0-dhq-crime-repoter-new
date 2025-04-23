"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "../hooks/use-language"
import { FileText, Map, BookOpen, User, Phone, AlertTriangle } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const { t } = useLanguage()

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>Common tasks you might want to perform</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Link href="/report">
          <Button className="w-full justify-start bg-gradient-to-r from-army-green to-army-green/90 hover:from-army-green/90 hover:to-army-green/80">
            <FileText className="mr-2 h-4 w-4" />
            Report a New Crime
          </Button>
        </Link>
        <Link href="/map">
          <Button className="w-full justify-start bg-gradient-to-r from-navy-blue to-navy-blue/90 hover:from-navy-blue/90 hover:to-navy-blue/80">
            <Map className="mr-2 h-4 w-4" />
            View Crime Map
          </Button>
        </Link>
        <Link href="/resources">
          <Button className="w-full justify-start bg-gradient-to-r from-airforce-blue to-airforce-blue/90 hover:from-airforce-blue/90 hover:to-airforce-blue/80">
            <BookOpen className="mr-2 h-4 w-4" />
            Safety Resources
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline" className="w-full justify-start border-primary/20 hover:bg-primary/5">
            <Phone className="mr-2 h-4 w-4" />
            Emergency Contacts
          </Button>
        </Link>
        <Link href="/admin/login">
          <Button variant="outline" className="w-full justify-start border-primary/20 hover:bg-primary/5">
            <User className="mr-2 h-4 w-4" />
            Admin Login
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

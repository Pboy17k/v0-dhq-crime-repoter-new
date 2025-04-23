"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useLanguage } from "../hooks/use-language"
import { AlertTriangle, Home, Phone, Shield, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export function SafetyTips() {
  const { t } = useLanguage()
  const [expandedTip, setExpandedTip] = useState<string | null>(null)

  const personalSafetyTips = [
    {
      id: "personal1",
      title: "Be aware of your surroundings",
      description: "Stay alert and pay attention to people and activities around you, especially in unfamiliar areas.",
    },
    {
      id: "personal2",
      title: "Avoid walking alone at night",
      description: "If possible, travel with a friend or in groups, especially after dark or in isolated areas.",
    },
    {
      id: "personal3",
      title: "Keep valuables out of sight",
      description: "Don't display expensive items like phones, jewelry, or cash in public places.",
    },
    {
      id: "personal4",
      title: "Trust your instincts",
      description: "If a situation or person makes you uncomfortable, remove yourself immediately.",
    },
  ]

  const homeSafetyTips = [
    {
      id: "home1",
      title: "Lock doors and windows",
      description: "Always secure all entry points to your home, even when you're inside.",
    },
    {
      id: "home2",
      title: "Install proper lighting",
      description: "Well-lit exteriors discourage intruders. Consider motion-activated lights.",
    },
    {
      id: "home3",
      title: "Use security systems",
      description: "Alarms, cameras, and other security measures can significantly reduce break-in risks.",
    },
    {
      id: "home4",
      title: "Know your neighbors",
      description: "Build relationships with neighbors who can watch your property when you're away.",
    },
  ]

  const emergencyContacts = [
    {
      id: "emergency1",
      title: "National Emergency",
      contact: "112",
      description: "For any life-threatening emergency situation",
    },
    {
      id: "emergency2",
      title: "Police",
      contact: "0803 123 4567",
      description: "To report crimes or suspicious activities",
    },
    {
      id: "emergency3",
      title: "DHQ Hotline",
      contact: "0700 CALL DHQ (0700 2255 349)",
      description: "Defence Headquarters direct contact line",
    },
    {
      id: "emergency4",
      title: "Fire Service",
      contact: "0802 345 6789",
      description: "For fire emergencies and rescue operations",
    },
  ]

  const toggleTip = (id: string) => {
    if (expandedTip === id) {
      setExpandedTip(null)
    } else {
      setExpandedTip(id)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Safety Tips
        </CardTitle>
        <CardDescription>Important safety information</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-4">
            {personalSafetyTips.map((tip) => (
              <div key={tip.id} className="border rounded-lg overflow-hidden transition-all duration-200">
                <div
                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleTip(tip.id)}
                >
                  <h3 className="font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                    {tip.title}
                  </h3>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${expandedTip === tip.id ? "rotate-90" : ""}`}
                  />
                </div>

                {expandedTip === tip.id && (
                  <div className="p-3 pt-0 border-t">
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-2">
              <Link href="/resources">
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View All Safety Resources
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="home" className="space-y-4 mt-4">
            {homeSafetyTips.map((tip) => (
              <div key={tip.id} className="border rounded-lg overflow-hidden transition-all duration-200">
                <div
                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleTip(tip.id)}
                >
                  <h3 className="font-medium flex items-center">
                    <Home className="h-4 w-4 mr-2 text-primary" />
                    {tip.title}
                  </h3>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${expandedTip === tip.id ? "rotate-90" : ""}`}
                  />
                </div>

                {expandedTip === tip.id && (
                  <div className="p-3 pt-0 border-t">
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-2">
              <Link href="/resources">
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View All Safety Resources
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4 mt-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="border rounded-lg overflow-hidden transition-all duration-200">
                <div
                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleTip(contact.id)}
                >
                  <h3 className="font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-red-500" />
                    {contact.title}
                  </h3>
                  <span className="text-sm font-bold">{contact.contact}</span>
                </div>

                {expandedTip === contact.id && (
                  <div className="p-3 pt-0 border-t">
                    <p className="text-sm text-muted-foreground">{contact.description}</p>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-2">
              <Link href="/contact">
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View All Contact Information
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

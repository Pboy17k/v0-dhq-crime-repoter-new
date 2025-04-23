import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ResourcesPage() {
  return (
    <div className="container py-6 md:py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Resources</h1>
      <p className="mb-8 text-muted-foreground">
        Access helpful information, guides, and resources related to crime prevention and reporting.
      </p>

      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guides">Reporting Guides</TabsTrigger>
          <TabsTrigger value="safety">Safety Tips</TabsTrigger>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How to Report a Crime Effectively</CardTitle>
              <CardDescription>Learn the best practices for reporting crimes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>When reporting a crime, try to include the following information:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>What happened (type of crime)</li>
                <li>When it happened (date and time)</li>
                <li>Where it happened (specific location)</li>
                <li>Who was involved (descriptions of suspects)</li>
                <li>Any evidence or witnesses</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Understanding Crime Categories</CardTitle>
              <CardDescription>Different types of crimes and how they're classified</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Crimes are generally categorized into:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Violent crimes (assault, robbery, homicide)</li>
                <li>Property crimes (theft, burglary, vandalism)</li>
                <li>Public order crimes (disorderly conduct)</li>
                <li>White-collar crimes (fraud, embezzlement)</li>
                <li>Cybercrime (hacking, online scams)</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Safety Tips</CardTitle>
              <CardDescription>Protect yourself in various situations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Be aware of your surroundings at all times</li>
                <li>Avoid walking alone in poorly lit or isolated areas</li>
                <li>Keep valuables out of sight in public</li>
                <li>Lock doors and windows when at home or leaving your vehicle</li>
                <li>Share your location with trusted contacts when traveling</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Home Security Guidelines</CardTitle>
              <CardDescription>Make your home safer against break-ins</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>Install quality locks on doors and windows</li>
                <li>Use timer switches for lights when away</li>
                <li>Consider security cameras or alarm systems</li>
                <li>Don't advertise expensive purchases or travel plans</li>
                <li>Join or form a neighborhood watch program</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Numbers</CardTitle>
              <CardDescription>Important contacts for immediate assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <strong>National Emergency Number:</strong> 112
                </li>
                <li>
                  <strong>Police:</strong> 0803 123 4567
                </li>
                <li>
                  <strong>Defence Headquarters:</strong> 0700 CALL DHQ (0700 2255 349)
                </li>
                <li>
                  <strong>Fire Service:</strong> 0802 345 6789
                </li>
                <li>
                  <strong>Medical Emergency:</strong> 0801 234 5678
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Agencies</CardTitle>
              <CardDescription>Contact information for various security agencies</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <strong>Nigeria Police Force:</strong> info@npf.gov.ng
                </li>
                <li>
                  <strong>Nigerian Army:</strong> info@army.mil.ng
                </li>
                <li>
                  <strong>Nigerian Navy:</strong> info@navy.mil.ng
                </li>
                <li>
                  <strong>Nigerian Air Force:</strong> info@airforce.mil.ng
                </li>
                <li>
                  <strong>Nigeria Security and Civil Defence Corps:</strong> info@nscdc.gov.ng
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

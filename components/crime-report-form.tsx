"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "../hooks/use-language"
import { useData } from "../hooks/use-data"
import { v4 as uuidv4 } from "uuid"
import type { CrimeReport } from "../types/crime-report"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"

// Comprehensive list of crimes in Nigeria including maritime crimes
const CRIME_TYPES = {
  VIOLENT: [
    "Murder",
    "Manslaughter",
    "Armed Robbery",
    "Kidnapping",
    "Terrorism",
    "Assault",
    "Rape/Sexual Assault",
    "Domestic Violence",
    "Human Trafficking",
  ],
  PROPERTY: ["Theft", "Burglary", "Arson", "Vandalism", "Fraud", "Cybercrime", "Identity Theft", "Forgery"],
  MARITIME: [
    "Piracy",
    "Sea Robbery",
    "Illegal Fishing",
    "Oil Bunkering",
    "Maritime Terrorism",
    "Smuggling",
    "Trafficking via Sea",
    "Illegal Oil Refining",
  ],
  FINANCIAL: ["Corruption", "Money Laundering", "Embezzlement", "Bribery", "Tax Evasion", "Advance Fee Fraud (419)"],
  DRUG: ["Drug Trafficking", "Drug Possession", "Drug Manufacturing", "Drug Distribution"],
  OTHER: [
    "Cultism",
    "Ritual Killing",
    "Illegal Possession of Firearms",
    "Banditry",
    "Cattle Rustling",
    "Communal Clashes",
    "Electoral Violence",
    "Other",
  ],
}

export function CrimeReportForm() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { addReport } = useData()

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [crimeType, setCrimeType] = useState("")
  const [crimeDate, setCrimeDate] = useState<Date | undefined>(new Date())
  const [crimeTime, setCrimeTime] = useState("12:00")
  const [isAtScene, setIsAtScene] = useState(false)
  const [wantsUpdates, setWantsUpdates] = useState(false)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Media state
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([])

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Handle media file selection
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setMediaFiles((prev) => [...prev, ...newFiles])

      // Create preview URLs
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
      setMediaPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  // Remove a media file
  const removeMedia = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(mediaPreviewUrls[index])

    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
    setMediaPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  // Start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioBlob(audioBlob)
        setAudioUrl(audioUrl)

        // Stop all tracks in the stream to release the microphone
        stream.getTracks().forEach((track) => track.stop())
      }

      // Start recording
      mediaRecorderRef.current.start()
      setIsRecording(true)

      // Start timer
      let seconds = 0
      timerRef.current = setInterval(() => {
        seconds++
        setRecordingTime(seconds)

        // Stop recording after 5 minutes (300 seconds)
        if (seconds >= 300) {
          stopRecording()
        }
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      toast({
        variant: "destructive",
        title: t("crimeReportForm.errors.recordingFailed") || "Recording Failed",
        description: t("crimeReportForm.errors.microphoneAccess") || "Could not access microphone",
      })
    }
  }

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  // Delete recorded audio
  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
  }

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Validate form
  const validateForm = () => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: t("crimeReportForm.errors.validation") || "Validation Error",
        description: t("crimeReportForm.errors.titleRequired") || "Title is required",
      })
      return false
    }

    if (!crimeType) {
      toast({
        variant: "destructive",
        title: t("crimeReportForm.errors.validation") || "Validation Error",
        description: t("crimeReportForm.errors.crimeTypeRequired") || "Crime type is required",
      })
      return false
    }

    if (!description.trim() && !audioBlob) {
      toast({
        variant: "destructive",
        title: t("crimeReportForm.errors.validation") || "Validation Error",
        description: t("crimeReportForm.errors.descriptionRequired") || "Description is required",
      })
      return false
    }

    if (!location.trim()) {
      toast({
        variant: "destructive",
        title: t("crimeReportForm.errors.validation") || "Validation Error",
        description: t("crimeReportForm.errors.locationRequired") || "Location is required",
      })
      return false
    }

    if (!crimeDate) {
      toast({
        variant: "destructive",
        title: t("crimeReportForm.errors.validation") || "Validation Error",
        description: t("crimeReportForm.errors.dateRequired") || "Date of crime is required",
      })
      return false
    }

    if (wantsUpdates) {
      // Validate email
      if (email && !/\S+@\S+\.\S+/.test(email)) {
        toast({
          variant: "destructive",
          title: t("crimeReportForm.errors.validation") || "Validation Error",
          description: t("crimeReportForm.errors.invalidEmail") || "Invalid email address",
        })
        return false
      }

      // Validate phone (simple validation)
      if (phone && !/^\d{10,15}$/.test(phone.replace(/[^0-9]/g, ""))) {
        toast({
          variant: "destructive",
          title: t("crimeReportForm.errors.validation") || "Validation Error",
          description: t("crimeReportForm.errors.invalidPhone") || "Invalid phone number",
        })
        return false
      }

      // At least one contact method required
      if (!email && !phone) {
        toast({
          variant: "destructive",
          title: t("crimeReportForm.errors.validation") || "Validation Error",
          description: t("crimeReportForm.errors.contactRequired") || "At least one contact method is required",
        })
        return false
      }
    }

    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Convert media files to base64 for storage
      const mediaBase64Promises = mediaFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(file)
        })
      })

      const mediaBase64 = await Promise.all(mediaBase64Promises)

      // Convert audio to base64 if exists
      let audioBase64 = null
      if (audioBlob) {
        const reader = new FileReader()
        audioBase64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(audioBlob)
        })
      }

      // Combine date and time
      const crimeDateTime = new Date(crimeDate!)
      const [hours, minutes] = crimeTime.split(":").map(Number)
      crimeDateTime.setHours(hours, minutes)

      // Create report object
      const report: CrimeReport = {
        id: uuidv4(),
        title,
        description,
        location,
        crimeType,
        timestamp: new Date().toISOString(),
        crimeDateTime: crimeDateTime.toISOString(),
        isAtScene,
        status: "pending",
        media: mediaBase64,
        audio: audioBase64,
        wantsUpdate: wantsUpdates,
        contactInfo: wantsUpdates ? { email, phone } : null,
        coordinates: {
          lat: 9.0765 + (Math.random() - 0.5) * 0.1, // Random coordinates near Abuja
          lng: 7.3986 + (Math.random() - 0.5) * 0.1,
        },
      }

      // Add report to data store
      addReport(report)

      // Show success message
      toast({
        title: t("crimeReportForm.success.title") || "Report Submitted",
        description: t("crimeReportForm.success.description") || "Your crime report has been submitted successfully",
      })

      // Reset form
      setTitle("")
      setDescription("")
      setLocation("")
      setCrimeType("")
      setCrimeDate(new Date())
      setCrimeTime("12:00")
      setIsAtScene(false)
      setWantsUpdates(false)
      setEmail("")
      setPhone("")
      setMediaFiles([])
      setMediaPreviewUrls([])
      setAudioBlob(null)
      setAudioUrl(null)
      setRecordingTime(0)
    } catch (error) {
      console.error("Error submitting report:", error)
      toast({
        variant: "destructive",
        title: t("crimeReportForm.errors.submissionFailed") || "Submission Failed",
        description: t("crimeReportForm.errors.tryAgain") || "Please try again later",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Revoke object URLs
      mediaPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [mediaPreviewUrls, audioUrl])

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">{t("crimeReportForm.fields.title.label") || "Crime Title"} *</Label>
          <Input
            id="title"
            placeholder={t("crimeReportForm.fields.title.placeholder") || "Enter a title for the crime report"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="crime-type">{t("crimeReportForm.fields.crimeType.label") || "Crime Type"} *</Label>
          <Select value={crimeType} onValueChange={setCrimeType} required>
            <SelectTrigger id="crime-type" className="w-full">
              <SelectValue placeholder={t("crimeReportForm.fields.crimeType.placeholder") || "Select crime type"} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CRIME_TYPES).map(([category, crimes]) => (
                <SelectGroup key={category}>
                  <SelectLabel>{category}</SelectLabel>
                  {crimes.map((crime) => (
                    <SelectItem key={crime} value={crime}>
                      {crime}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="crime-date">{t("crimeReportForm.fields.date.label") || "Date of Crime"} *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" id="crime-date">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {crimeDate ? format(crimeDate, "PPP") : t("crimeReportForm.fields.date.placeholder") || "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={crimeDate}
                  onSelect={setCrimeDate}
                  initialFocus
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="crime-time">{t("crimeReportForm.fields.time.label") || "Time of Crime"} *</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                id="crime-time"
                type="time"
                value={crimeTime}
                onChange={(e) => setCrimeTime(e.target.value)}
                className="flex-1"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">{t("crimeReportForm.fields.location.label") || "Location"} *</Label>
          <Input
            id="location"
            placeholder={t("crimeReportForm.fields.location.placeholder") || "Enter the location of the crime"}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox id="at-scene" checked={isAtScene} onCheckedChange={(checked) => setIsAtScene(checked as boolean)} />
          <Label
            htmlFor="at-scene"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("crimeReportForm.fields.atScene.label") || "I am currently at the crime scene"}
          </Label>
        </div>

        <div className="space-y-2">
          <Label>{t("crimeReportForm.fields.description.label") || "Description"} *</Label>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">{t("crimeReportForm.fields.description.textTab") || "Text"}</TabsTrigger>
              <TabsTrigger value="audio">{t("crimeReportForm.fields.description.audioTab") || "Audio"}</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="space-y-4">
              <Textarea
                placeholder={
                  t("crimeReportForm.fields.description.textPlaceholder") || "Describe the crime in detail..."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[150px]"
              />
            </TabsContent>
            <TabsContent value="audio" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  {!audioUrl ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {isRecording
                          ? t("crimeReportForm.fields.description.recording", { time: formatTime(recordingTime) }) ||
                            `Recording... ${formatTime(recordingTime)}`
                          : t("crimeReportForm.fields.description.recordInstructions") ||
                            "Click the button below to start recording your report"}
                      </p>
                      <div className="flex space-x-2">
                        {isRecording ? (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={stopRecording}
                            className="flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2 h-4 w-4"
                            >
                              <rect width="4" height="16" x="6" y="4" />
                              <rect width="4" height="16" x="14" y="4" />
                            </svg>
                            {t("crimeReportForm.fields.description.stopRecording") || "Stop Recording"}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={startRecording}
                            className="flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2 h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            {t("crimeReportForm.fields.description.startRecording") || "Start Recording"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {t("crimeReportForm.fields.description.recordingComplete") || "Recording complete"}
                      </p>
                      <audio src={audioUrl} controls className="w-full" />
                      <div className="flex space-x-2">
                        <Button type="button" variant="outline" onClick={deleteRecording}>
                          {t("crimeReportForm.fields.description.deleteRecording") || "Delete Recording"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={startRecording}>
                          {t("crimeReportForm.fields.description.recordAgain") || "Record Again"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="media">{t("crimeReportForm.fields.media.label") || "Upload Photos/Videos"}</Label>
          <div className="grid gap-4">
            <Input
              id="media"
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              multiple
              className="cursor-pointer"
            />

            {mediaPreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {mediaPreviewUrls.map((url, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden border">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeMedia(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="updates"
            checked={wantsUpdates}
            onCheckedChange={(checked) => setWantsUpdates(checked as boolean)}
          />
          <Label
            htmlFor="updates"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("crimeReportForm.fields.updates.label") || "I want to receive updates on this report"}
          </Label>
        </div>

        {wantsUpdates && (
          <div className="space-y-4 rounded-md border p-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("crimeReportForm.fields.email.label") || "Email Address"}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("crimeReportForm.fields.email.placeholder") || "Enter your email address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("crimeReportForm.fields.phone.label") || "Phone Number"}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t("crimeReportForm.fields.phone.placeholder") || "Enter your phone number"}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              {t("crimeReportForm.fields.updates.privacyNote") ||
                "Your contact information will be kept confidential and only used to provide updates on this report."}
            </p>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? t("crimeReportForm.submitting") || "Submitting..."
          : t("crimeReportForm.submit") || "Submit Report"}
      </Button>
    </form>
  )
}

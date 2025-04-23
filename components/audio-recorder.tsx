"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Play, Trash2, Save } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface AudioRecorderProps {
  onAudioSaved: (audioBlob: Blob) => void
  onAudioCleared: () => void
  maxDuration?: number // in seconds
}

export function AudioRecorder({
  onAudioSaved,
  onAudioCleared,
  maxDuration = 300, // 5 minutes default
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null)

  const { toast } = useToast()

  // Initialize audio player
  useEffect(() => {
    audioPlayerRef.current = new Audio()
    audioPlayerRef.current.addEventListener("ended", () => {
      setIsPlaying(false)
      setPlaybackTime(0)
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current)
      }
    })

    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
        audioPlayerRef.current.src = ""
      }
    }
  }, [])

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setAudioBlob(audioBlob)
        setAudioDuration(recordingTime)

        // Create URL for playback
        if (audioPlayerRef.current) {
          const audioUrl = URL.createObjectURL(audioBlob)
          audioPlayerRef.current.src = audioUrl
        }
      }

      // Start recording
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()

      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())

      // Clear timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }

      setIsRecording(false)
    }
  }

  // Play recorded audio
  const playAudio = () => {
    if (audioPlayerRef.current && audioBlob) {
      audioPlayerRef.current.play()
      setIsPlaying(true)

      // Start playback timer
      setPlaybackTime(0)
      playbackTimerRef.current = setInterval(() => {
        if (audioPlayerRef.current) {
          setPlaybackTime(audioPlayerRef.current.currentTime)
        }
      }, 100)
    }
  }

  // Pause playback
  const pauseAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      setIsPlaying(false)

      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current)
      }
    }
  }

  // Delete recording
  const deleteAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current.src = ""
    }

    setAudioBlob(null)
    setIsPlaying(false)
    setPlaybackTime(0)
    setAudioDuration(0)
    onAudioCleared()
  }

  // Save recording
  const saveAudio = () => {
    if (audioBlob) {
      onAudioSaved(audioBlob)
      toast({
        title: "Audio Saved",
        description: "Your voice recording has been saved to the report.",
      })
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const recordingProgress = (recordingTime / maxDuration) * 100
  const playbackProgress = audioDuration > 0 ? (playbackTime / audioDuration) * 100 : 0

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Voice Recording</h3>
        {isRecording && (
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-red-500">●</span>
            <span>Recording</span>
          </div>
        )}
      </div>

      {/* Timer and Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{isRecording ? formatTime(recordingTime) : formatTime(playbackTime)}</span>
          <span>{isRecording ? formatTime(maxDuration) : audioBlob ? formatTime(audioDuration) : "00:00"}</span>
        </div>
        <Progress
          value={isRecording ? recordingProgress : playbackProgress}
          className={isRecording ? "bg-red-100" : ""}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        {!audioBlob ? (
          // Recording controls
          <>
            {!isRecording ? (
              <Button
                onClick={startRecording}
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full bg-red-50 hover:bg-red-100 text-red-500"
              >
                <Mic className="h-6 w-6" />
                <span className="sr-only">Start Recording</span>
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full bg-red-50 hover:bg-red-100 text-red-500"
              >
                <Square className="h-5 w-5" />
                <span className="sr-only">Stop Recording</span>
              </Button>
            )}
          </>
        ) : (
          // Playback controls
          <div className="flex items-center gap-3">
            {!isPlaying ? (
              <Button onClick={playAudio} variant="outline" size="icon" className="h-10 w-10 rounded-full">
                <Play className="h-5 w-5" />
                <span className="sr-only">Play</span>
              </Button>
            ) : (
              <Button onClick={pauseAudio} variant="outline" size="icon" className="h-10 w-10 rounded-full">
                <Square className="h-4 w-4" />
                <span className="sr-only">Pause</span>
              </Button>
            )}

            <Button onClick={deleteAudio} variant="outline" size="icon" className="h-10 w-10 rounded-full text-red-500">
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Delete</span>
            </Button>

            <Button onClick={saveAudio} variant="outline" size="icon" className="h-10 w-10 rounded-full text-green-500">
              <Save className="h-5 w-5" />
              <span className="sr-only">Save</span>
            </Button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <p className="text-sm text-muted-foreground text-center">
        {!audioBlob
          ? isRecording
            ? "Click the square to stop recording"
            : "Click the microphone to start recording"
          : "Listen to your recording, delete it, or save it to your report"}
      </p>
    </div>
  )
}

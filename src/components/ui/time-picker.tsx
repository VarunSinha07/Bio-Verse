"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  // Parse initial values from the input value
  const parseInitialTime = () => {
    if (!value) return { hours: 12, minutes: 0, period: "AM" as const }

    try {
      const timeParts = value.split(":")
      let hours = Number.parseInt(timeParts[0])

      // Handle minutes and period
      const minutesPeriodPart = timeParts[1] || "00 AM"
      const [minutesStr, periodStr] = minutesPeriodPart.split(" ")
      const minutes = Number.parseInt(minutesStr)
      let period = periodStr?.toUpperCase() === "PM" ? ("PM" as const) : ("AM" as const)

      // Convert 24-hour format to 12-hour if needed
      if (hours > 12) {
        hours = hours - 12
        period = "PM"
      } else if (hours === 0) {
        hours = 12
        period = "AM"
      } else if (hours === 12) {
        period = "PM"
      }

      return {
        hours: isNaN(hours) ? 12 : hours,
        minutes: isNaN(minutes) ? 0 : minutes,
        period,
      }
    } catch (e) {
      console.error("Error parsing time:", e)
      return { hours: 12, minutes: 0, period: "AM" as const }
    }
  }

  const { hours: initialHours, minutes: initialMinutes, period: initialPeriod } = parseInitialTime()

  const [hours, setHours] = React.useState<number>(initialHours)
  const [minutes, setMinutes] = React.useState<number>(initialMinutes)
  const [period, setPeriod] = React.useState<"AM" | "PM">(initialPeriod)

  // Format and update the time string
  const updateTimeString = React.useCallback(() => {
    const formattedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`
    onChange(formattedTime)
  }, [hours, minutes, period, onChange])

  // Update time when component values change
  React.useEffect(() => {
    updateTimeString()
  }, [hours, minutes, period, updateTimeString])

  // Clock face rendering
  const renderClockFace = () => {
    const clockNumbers = Array.from({ length: 12 }, (_, i) => i + 1)
    const radius = 100
    const centerX = 120
    const centerY = 120

    return (
      <div className="relative w-[240px] h-[240px] rounded-full bg-muted/30 border border-border">
        <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-primary transform -translate-x-1/2 -translate-y-1/2" />

        {/* Hour hand */}
        <div
          className="absolute top-1/2 left-1/2 w-1 bg-primary rounded-full origin-bottom transform -translate-x-1/2"
          style={{
            height: "40px",
            transform: `rotate(${(hours % 12) * 30 + minutes * 0.5}deg) translateY(-20px)`,
          }}
        />

        {/* Minute hand */}
        <div
          className="absolute top-1/2 left-1/2 w-0.5 bg-primary-foreground rounded-full origin-bottom transform -translate-x-1/2"
          style={{
            height: "60px",
            transform: `rotate(${minutes * 6}deg) translateY(-30px)`,
          }}
        />

        {/* Clock numbers */}
        {clockNumbers.map((num) => {
          const angle = ((num - 3) * 30 * Math.PI) / 180
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)

          return (
            <Button
              key={num}
              variant="ghost"
              size="sm"
              className={cn(
                "absolute w-8 h-8 rounded-full flex items-center justify-center p-0 text-sm",
                hours === num && "bg-primary text-primary-foreground",
              )}
              style={{
                left: `${x - 16}px`,
                top: `${y - 16}px`,
              }}
              onClick={() => setHours(num)}
            >
              {num}
            </Button>
          )
        })}
      </div>
    )
  }

  // Minute selector
  const renderMinuteSelector = () => {
    const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

    return (
      <div className="grid grid-cols-4 gap-2 mt-4">
        {minuteOptions.map((min) => (
          <Button
            key={min}
            variant={minutes === min ? "default" : "outline"}
            size="sm"
            className="h-8"
            onClick={() => setMinutes(min)}
          >
            {min.toString().padStart(2, "0")}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", className)}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || <span>Select time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-semibold">
              {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}
            </div>
            <div className="flex gap-1">
              <Button variant={period === "AM" ? "default" : "outline"} size="sm" onClick={() => setPeriod("AM")}>
                AM
              </Button>
              <Button variant={period === "PM" ? "default" : "outline"} size="sm" onClick={() => setPeriod("PM")}>
                PM
              </Button>
            </div>
          </div>

          {renderClockFace()}

          <div>
            <Label className="text-xs font-medium">Minutes</Label>
            {renderMinuteSelector()}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}


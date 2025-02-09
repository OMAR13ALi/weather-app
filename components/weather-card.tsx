"use client"

import { useState } from "react"
import {
  Cloud,
  CloudRain,
  Search,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  Loader2,
  CloudFog,
  CloudLightning,
  CloudSnow,
  Moon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface WeatherData {
  name: string
  weather: Array<{ id: number; main: string; description: string }>
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    temp_min: number
    temp_max: number
  }
  wind: {
    speed: number
    deg: number
  }
  sys: {
    sunrise: number
    sunset: number
  }
  visibility: number
}

export function WeatherCard() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { theme } = useTheme()

  const fetchWeather = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch weather data")
      }

      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = () => {
    if (!weather) return null
    const code = weather.weather[0].id
    if (code >= 200 && code < 300) return <CloudLightning className="h-16 w-16" />
    if (code >= 300 && code < 500) return <CloudRain className="h-16 w-16" />
    if (code >= 500 && code < 600) return <CloudRain className="h-16 w-16" />
    if (code >= 600 && code < 700) return <CloudSnow className="h-16 w-16" />
    if (code >= 700 && code < 800) return <CloudFog className="h-16 w-16" />
    if (code === 800) return <Sun className="h-16 w-16" />
    return <Cloud className="h-16 w-16" />
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>Enter a city name to get detailed weather information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={fetchWeather} className="flex gap-2 mb-4">
            <Input
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </form>

          {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>}

          {weather && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{weather.name}</h2>
                  <p className="text-muted-foreground capitalize">{weather.weather[0].description}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</div>
                  <p className="text-muted-foreground">Feels like {Math.round(weather.main.feels_like)}°C</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                  icon={<Thermometer className="h-4 w-4" />}
                  title="Min/Max"
                  value={`${Math.round(weather.main.temp_min)}°/${Math.round(weather.main.temp_max)}°`}
                />
                <MetricCard
                  icon={<Wind className="h-4 w-4" />}
                  title="Wind Speed"
                  value={`${Math.round(weather.wind.speed * 3.6)} km/h`}
                />
                <MetricCard
                  icon={<Droplets className="h-4 w-4" />}
                  title="Humidity"
                  value={`${weather.main.humidity}%`}
                />
                <MetricCard
                  icon={<Gauge className="h-4 w-4" />}
                  title="Pressure"
                  value={`${weather.main.pressure} hPa`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Sunrise</p>
                        <p className="text-xl font-medium">{formatTime(weather.sys.sunrise)}</p>
                      </div>
                      <Sun className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Sunset</p>
                        <p className="text-xl font-medium">{formatTime(weather.sys.sunset)}</p>
                      </div>
                      <Moon className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-4">
                  {getWeatherIcon()}
                  <div className="space-y-1">
                    <p className="text-xl font-medium">Current Conditions</p>
                    <p className="text-sm text-muted-foreground">
                      Visibility: {(weather.visibility / 1000).toFixed(1)} km
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          {icon}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-lg font-medium">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


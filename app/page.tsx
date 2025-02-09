
import { ThemeToggle } from "@/components/theme-toggle"
import { WeatherCard } from "@/components/weather-card"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-6">
          <ThemeToggle />
        </div>
        <WeatherCard />
      </div>
    </main>
  )
}


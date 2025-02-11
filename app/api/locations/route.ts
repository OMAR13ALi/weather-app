import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${process.env.OPENWEATHER_API_KEY}`,
    )
    const data = await response.json()

    if (!response.ok) {
      throw new Error("Failed to fetch location suggestions")
    }

    const suggestions = data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
    }))

    return NextResponse.json(suggestions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch location suggestions" }, { status: 500 })
  }
}


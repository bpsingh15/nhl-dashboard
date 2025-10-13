/*

Runs on the server (safe for API key use)

Fetches data from Sportradar’s NHL endpoint

Returns JSON (mock-transformed at first)

*/

import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.SPORTRADAR_API_KEY;
  const season = "2025"; // 2025–26 season
  const url = `https://api.sportradar.com/nhl/trial/v7/en/seasons/${season}/REG/standings.json?api_key=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache for 1 hr
    if (!res.ok) throw new Error(`Sportradar API error: ${res.status}`);

    const data = await res.json();

    // For now, mock top scorers (we'll compute real stats soon)
    const mockTopScorers = [
      { name: "Connor McDavid", goals: 12, assists: 15 },
      { name: "Auston Matthews", goals: 11, assists: 8 },
      { name: "Nathan MacKinnon", goals: 10, assists: 14 },
      { name: "Leon Draisaitl", goals: 9, assists: 12 },
      { name: "David Pastrnak", goals: 8, assists: 10 },
    ];

    return NextResponse.json({
      status: "success",
      season,
      lastUpdated: new Date().toISOString(),
      data: mockTopScorers,
    });
  } catch (err: any) {
    console.error("Error fetching Sportradar data:", err);
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}

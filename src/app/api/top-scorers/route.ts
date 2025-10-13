/*

Runs on the server (safe for API key use)

Fetches data from Sportradar’s NHL endpoint

Returns JSON (mock-transformed at first)

*/

import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.SPORTRADAR_API_KEY;
  const season = "2025"; // 2025–26
  const baseUrl = `https://api.sportradar.us/nhl/trial/v7/en`;

  try {
    // 1️⃣ Get all teams for this season
    const teamRes = await fetch(
      `${baseUrl}/league/teams.json?api_key=${apiKey}`,
      { next: { revalidate: 21600 } }
    );

    if (!teamRes.ok) throw new Error("Failed to fetch teams");
    const teamData = await teamRes.json();

    // 2️⃣ For each team, get player stats
    const playerStats: any[] = [];
    for (const team of teamData.teams.slice(0, 5)) {
      // Limit to 5 for now (to avoid rate limits)
      const statsRes = await fetch(
        `${baseUrl}/teams/${team.id}/statistics.json?api_key=${apiKey}`,
        { next: { revalidate: 21600 } }
      );
      if (!statsRes.ok) continue;
      const statsData = await statsRes.json();

      // 3️⃣ Extract player data
      const players =
        statsData.players?.map((p: any) => ({
          name: `${p.first_name} ${p.last_name}`,
          team: team.name,
          goals: p.statistics?.goals || 0,
          assists: p.statistics?.assists || 0,
          points: (p.statistics?.goals || 0) + (p.statistics?.assists || 0),
        })) || [];

      playerStats.push(...players);
    }

    // 4️⃣ Sort players by goals and take top 10
    const topScorers = playerStats
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10);

    return NextResponse.json({
      status: "success",
      season,
      lastUpdated: new Date().toISOString(),
      topScorers,
    });
  } catch (err: any) {
    console.error("Error fetching Sportradar data:", err);
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}

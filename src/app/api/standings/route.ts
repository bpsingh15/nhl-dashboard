import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.SPORTRADAR_API_KEY;
  const baseUrl = "https://api.sportradar.us/nhl/trial/v7/en";

  try {
    const res = await fetch(
      `${baseUrl}/seasons/2025/REG/standings.json?api_key=${apiKey}`,
      { next: { revalidate: 21600 } }
    );

    if (!res.ok) throw new Error("Failed to fetch standings");
    const data = await res.json();

    // Collect all teams with points
    const allTeams: any[] = [];
    data.conferences?.forEach((conf: any) => {
      conf.divisions?.forEach((div: any) => {
        div.teams?.forEach((team: any) => {
          allTeams.push({
            name: `${team.market} ${team.name}`,
            conference: conf.name,
            division: div.name,
            wins: team.wins,
            losses: team.losses,
            otLosses: team.overtime_losses,
            points: team.points,
            streak: team.streak?.length || 0,
            streakType: team.streak?.type || "none",
          });
        });
      });
    });

    // Sort by points (highest first)
    const sorted = allTeams.sort((a, b) => b.points - a.points);

    return NextResponse.json({
      status: "success",
      lastUpdated: new Date().toISOString(),
      teams: sorted, // top 10 for now
    });
  } catch (err: any) {
    console.error("Error fetching standings:", err);
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}

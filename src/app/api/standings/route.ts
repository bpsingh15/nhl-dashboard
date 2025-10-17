import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const apiKey = process.env.SPORTRADAR_API_KEY;
  const baseUrl = "https://api.sportradar.us/nhl/trial/v7/en";
  const { searchParams } = new URL(req.url);
  const view = searchParams.get("view") || "league";

  try {
    const res = await fetch(
      `${baseUrl}/seasons/2025/REG/standings.json?api_key=${apiKey}`,
      { next: { revalidate: 21600 } }
    );
    if (!res.ok) throw new Error("Failed to fetch standings");
    const data = await res.json();

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
          });
        });
      });
    });

    // 🪄 Simulate “view mode” filters (for UX testing)
    let filteredTeams = [...allTeams];

    if (view === "conference") {
      // Top 3 per conference (mocked filter)
      filteredTeams = allTeams
        .filter((t) => t.conference === "Eastern" || t.conference === "Western")
        .slice(0, 6);
    } else if (view === "division") {
      // Top 2 per division (mocked filter)
      filteredTeams = allTeams.slice(0, 8);
    }

    const sorted = filteredTeams.sort((a, b) => b.points - a.points);

    return NextResponse.json({
      status: "success",
      view,
      teams: sorted,
    });
  } catch (err: any) {
    console.error("Error fetching standings:", err);
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}

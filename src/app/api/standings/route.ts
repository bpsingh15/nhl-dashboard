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

    // Helper to normalize teams
    const normalizeTeam = (team: any, confName: string, divName: string) => ({
      id: team.id,
      name: `${team.market} ${team.name}`,
      conference: confName,
      division: divName,
      gamesPlayed: team.games_played,
      wins: team.wins,
      losses: team.losses,
      otLosses: team.overtime_losses,
      points: team.points,
      goalsFor: team.goals_for,
      goalsAgainst: team.goals_against,
      goalDiff: team.goals_for - team.goals_against,
      streak: team.streak?.length || 0,
      streakType: team.streak?.type || "none",
    });

    // Parse based on requested view
    let output: any[] = [];

    if (view === "league") {
      // Flatten all teams
      data.conferences?.forEach((conf: any) => {
        conf.divisions?.forEach((div: any) => {
          div.teams?.forEach((team: any) => {
            output.push(normalizeTeam(team, conf.name, div.name));
          });
        });
      });
    } else if (view === "conference") {
      // Group by conference
      output = data.conferences?.map((conf: any) => ({
        name: conf.name,
        divisions: conf.divisions?.map((div: any) => ({
          name: div.name,
          teams: div.teams?.map((team: any) =>
            normalizeTeam(team, conf.name, div.name)
          ),
        })),
      }));
    } else if (view === "division") {
      // Group by division (flatten across all conferences)
      const divisions: Record<string, any[]> = {};

      data.conferences?.forEach((conf: any) => {
        conf.divisions?.forEach((div: any) => {
          if (!divisions[div.name]) divisions[div.name] = [];
          div.teams?.forEach((team: any) => {
            divisions[div.name].push(normalizeTeam(team, conf.name, div.name));
          });
        });
      });

      output = Object.entries(divisions).map(([name, teams]) => ({
        name,
        teams: (teams as any[]).sort((a, b) => b.points - a.points),
      }));
    }

    return NextResponse.json({
      status: "success",
      view,
      standings: output,
    });
  } catch (err: any) {
    console.error("Error fetching standings:", err);
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}

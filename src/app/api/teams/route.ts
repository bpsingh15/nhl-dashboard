import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.SPORTRADAR_API_KEY;
  const baseUrl = "https://api.sportradar.us/nhl/trial/v7/en";

  try {
    const res = await fetch(
      `${baseUrl}/league/hierarchy.json?api_key=${apiKey}`,
      {
        next: { revalidate: 21600 }, // cache for 6 hours
      }
    );
    if (!res.ok) throw new Error("Failed to fetch hierarchy");

    const data = await res.json();

    // Extract simple list of teams
    const teams: any[] = [];
    data.conferences?.forEach((conf: any) => {
      conf.divisions?.forEach((div: any) => {
        div.teams?.forEach((team: any) => {
          teams.push({
            name: `${team.market} ${team.name}`,
            division: div.name,
            conference: conf.name,
          });
        });
      });
    });

    return NextResponse.json({
      status: "success",
      count: teams.length,
      teams,
    });
  } catch (err: any) {
    console.error("Error fetching teams:", err);
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}

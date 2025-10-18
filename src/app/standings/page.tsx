"use client";
import { useState, useEffect } from "react";

type ViewMode = "league" | "conference" | "division";

export default function StandingsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("league");

  useEffect(() => {
    async function fetchStandings() {
      const res = await fetch(`/api/standings?view=${viewMode}`);
      const json = await res.json();
      setData(json.standings || []);
      setLoading(false);
    }
    fetchStandings();
  }, [viewMode]);

  if (loading) return <p>Loading standings...</p>;

  return (
    <div className="bg-[#1B1B3A] p-6 rounded-xl shadow-md text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {viewMode === "league"
            ? "🏆 League Standings"
            : viewMode === "conference"
            ? "🏒 Conference Standings"
            : "🧭 Division Standings"}
        </h1>

        <div className="space-x-2">
          {(["league", "conference", "division"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-lg ${
                viewMode === mode
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {mode[0].toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {viewMode === "league" && (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-2">Rank</th>
              <th>Team</th>
              <th>GP</th>
              <th>W</th>
              <th>L</th>
              <th>OT</th>
              <th>PTS</th>
              <th>GF</th>
              <th>GA</th>
              <th>DIFF</th>
            </tr>
          </thead>
          <tbody>
            {data
              .sort((a: any, b: any) => b.points - a.points)
              .map((team: any, i: number) => (
                <tr key={team.id || i} className="border-b border-gray-700">
                  <td className="py-2">{i + 1}</td>
                  <td>{team.name}</td>
                  <td>{team.gamesPlayed}</td>
                  <td>{team.wins}</td>
                  <td>{team.losses}</td>
                  <td>{team.otLosses}</td>
                  <td className="font-bold">{team.points}</td>
                  <td>{team.goalsFor}</td>
                  <td>{team.goalsAgainst}</td>
                  <td
                    className={
                      team.goalDiff > 0
                        ? "text-green-400"
                        : team.goalDiff < 0
                        ? "text-red-400"
                        : "text-gray-300"
                    }
                  >
                    {team.goalDiff > 0 ? "+" : ""}
                    {team.goalDiff}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {viewMode !== "league" &&
        data.map((group: any) => (
          <div key={group.name} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
            <table className="w-full text-left border-collapse mb-4">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-2">Rank</th>
                  <th>Team</th>
                  <th>GP</th>
                  <th>W</th>
                  <th>L</th>
                  <th>OT</th>
                  <th>PTS</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th>DIFF</th>
                </tr>
              </thead>
              <tbody>
                {group.teams?.map((team: any, i: number) => (
                  <tr key={team.id || i} className="border-b border-gray-700">
                    <td className="py-2">{i + 1}</td>
                    <td>{team.name}</td>
                    <td>{team.gamesPlayed}</td>
                    <td>{team.wins}</td>
                    <td>{team.losses}</td>
                    <td>{team.otLosses}</td>
                    <td className="font-bold">{team.points}</td>
                    <td>{team.goalsFor}</td>
                    <td>{team.goalsAgainst}</td>
                    <td
                      className={
                        team.goalDiff > 0
                          ? "text-green-400"
                          : team.goalDiff < 0
                          ? "text-red-400"
                          : "text-gray-300"
                      }
                    >
                      {team.goalDiff > 0 ? "+" : ""}
                      {team.goalDiff}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}

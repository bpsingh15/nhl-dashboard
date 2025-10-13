"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/top-scorers");
        const json = await res.json();
        setPlayers(json.data);
      } catch (err) {
        console.error("Failed to fetch players:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p className="p-4">Loading top scorers...</p>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        🏒 Top Scorers (Last 5–10 Games)
      </h1>
      <ul className="space-y-2">
        {players.map((p, i) => (
          <li key={i} className="border p-4 rounded-lg">
            <strong>{p.name}</strong> — {p.goals} G / {p.assists} A
          </li>
        ))}
      </ul>
    </main>
  );
}

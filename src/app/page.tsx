"use client";

import { useEffect, useState } from "react";

type ViewMode = "league" | "conference" | "division";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-4xl font-bold mb-4">Welcome to the NHL Dashboard</h2>
      <p className="text-gray-400">
        Use the sidebar to navigate to Standings and explore live stats.
      </p>
    </div>
  );
}

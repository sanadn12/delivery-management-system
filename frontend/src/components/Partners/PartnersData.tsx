"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

type Metrics = {
  totalActive: number;
  avgRating: number;
  topAreas: string[];
};

const PartnersData = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/assignments/metrics`
        );
        const fetchedMetrics = response.data;

        if (fetchedMetrics.topAreas) {
          const topAreas: string[] = fetchedMetrics.topAreas.flatMap(
            (area: string | string[]) => {
              if (typeof area === "string") {
                return area.split(",").map((a) => a.trim());
              }
              return area;
            }
          );

          // Count occurrences
          const areaCount: Record<string, number> = {};
          topAreas.forEach((area) => {
            areaCount[area] = (areaCount[area] || 0) + 1;
          });

          // Sort areas by count (highest first) & extract only names
          fetchedMetrics.topAreas = Object.entries(areaCount)
            .sort((a, b) => b[1] - a[1]) // Sort descending by count
            .map(([name]) => name); // Extract only area names
        }

        setMetrics(fetchedMetrics);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <p className="text-center text-lg font-semibold text-gray-500">Loading metrics...</p>;
  }

  return (
    <div className="max-w-4xl rounded-4xl bg-blue-200 mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
        Partners Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Active Partners */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg rounded-xl p-6 text-center text-white">
          <h3 className="text-lg font-medium">Total Active Partners</h3>
          <p className="text-4xl font-extrabold mt-2">{metrics?.totalActive}</p>
        </div>

        {/* Average Rating */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 shadow-lg rounded-xl p-6 text-center text-white">
          <h3 className="text-lg font-medium">Average Rating</h3>
          <p className="text-4xl font-extrabold mt-2">
            {metrics?.avgRating ? Number(metrics.avgRating).toFixed(1) : "N/A"}
          </p>
        </div>
      </div>

      {/* Top Areas */}
      <div className="bg-white shadow-lg rounded-xl p-6 mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Top Areas</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {metrics?.topAreas.map((area, index) => (
            <div
              key={index}
              className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-center shadow-md hover:bg-gray-200 transition duration-300"
            >
              {area}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersData;
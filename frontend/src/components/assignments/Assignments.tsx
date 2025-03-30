"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Assignment {
  orderId: number;
  partnerId: number;
  assignmentStatus: "success" | "failed";
  timestamp: Date;
  status: "success" | "failed";
  reason?: string;
  orderStatus: "pending" | "cancelled" | "assigned" | "picked" | "delivered";
}

interface FailureReason {
  reason: string;
  count: number;
}

interface AssignmentsProps {
  totalAssigned: number;
  busyPartners: number;
  offlinePartners: number;
  availablePartners: number;
  successRate: number;
  averageTime: number;
  failureReasons: FailureReason[];
  assignmentsWithOrderDetails: Assignment[];

  totalActive: number;
  avgRating: number;
  topAreas: string[];
  activeAssignments: Assignment[];
  partners: {
    available: number;
    busy: number;
    offline: number;
  };
}

const Assignments = () => {
  const [data, setData] = useState<AssignmentsProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  useEffect(() => {
    const fetchAssignmentsData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API}/assignments/metrics`);
        if (response.data) {
          setData(response.data);
        } else {
          throw new Error("Assignments data is missing in the response.");
        }
      } catch (error: any) {
        setError(error.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentsData();
  }, []);

  if (loading) return <div className="flex justify-center items-center"><div className="w-8 h-8 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div></div>;
  if (error) return <div className="text-red-500">{`Error: ${error}`}</div>;

  if (!data) return <div>No data available</div>;

  const { totalAssigned, successRate, assignmentsWithOrderDetails, averageTime, offlinePartners, failureReasons, busyPartners, totalActive, avgRating, topAreas, availablePartners, activeAssignments, partners } = data;
  const activeAssignmentsFiltered = assignmentsWithOrderDetails.filter(
    (assignment) => assignment.orderStatus !== "delivered"
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl md:text-4xl text-center font-semibold mb-6">Assignments Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assignment Metrics */}
        <div className="bg-blue-200 shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-medium mb-4">Assignment Metrics</h3>
          <p>Total Assigned: {totalAssigned}</p>
          <p>Success Rate: {successRate}%</p>
          <p>Average Time: {averageTime} seconds</p>
          <div className="my-4 border-t border-gray-200"></div>
          <h4 className="text-xl font-medium mb-2">Failure Reasons</h4>
          <ul>
            {failureReasons.length > 0 ? (
              failureReasons.map((reason, index) => (
                <li key={index} className="flex justify-between py-2 border-b border-gray-200">
                  <span>{reason.reason}</span>
                  <span>Count: {reason.count}</span>
                </li>
              ))
            ) : (
              <li>No failure reasons available</li>
            )}
          </ul>
        </div>

        {/* Partner Status */}
        <div className="bg-blue-500 shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-medium mb-4">Partner Status</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-300 p-4 rounded-lg text-center">
              <span className="text-lg font-medium">Active</span>
              <p className="text-xl font-bold">{totalActive}</p>
            </div>
            <div className="bg-yellow-200 p-4 rounded-lg text-center">
              <span className="text-lg font-medium">Busy</span>
              <p className="text-xl font-bold">{busyPartners}</p>
            </div>
            <div className="bg-red-200 p-4 rounded-lg text-center">
              <span className="text-lg font-medium">Offline</span>
              <p className="text-xl font-bold">{offlinePartners}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Assignments */}
      <div className="bg-blue-50 shadow-md rounded-lg p-6 mt-6">
        <h3 className="text-2xl font-medium mb-4">Active Assignments</h3>
        {activeAssignmentsFiltered.length > 0 ? (
          <ul>
            {activeAssignmentsFiltered.map((assignment, index) => (
              <li key={index} className="py-4 border-b border-gray-200">
                <p className="text-lg font-medium">
                  Order ID: {assignment.orderId} - Partner ID: {assignment.partnerId}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      assignment.assignmentStatus === "success"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {assignment.assignmentStatus === "success" ? "Success" : "Failed"}
                  </span>
                  {assignment.reason && <p className="text-sm">Reason: {assignment.reason}</p>}
                </div>
                <p className="text-sm mt-2">Timestamp: {new Date(assignment.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No active assignments</p>
        )}
      </div>
    </div>
  );
};

export default Assignments;

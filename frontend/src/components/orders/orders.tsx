"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

type Order = {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: { name: string; price: number; quantity: number }[];
  scheduledFor: string;
  assignedTo: string;
  area: string;
  status: "pending" | "assigned" | "picked" | "delivered";
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  partnerId?: string;
  partnerName?: string;
  partnerPhone?: string;
  assignmentError?: string;
  date: string;
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [dateFilter, setDateFilter]= useState("");
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 60000); // Auto-fetch orders every minute
    return () => clearInterval(interval); 
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get<Order[]>(`${BACKEND_API}/orders/`);
      setOrders(response.data);
      setFilteredOrders(response.data);
      // Auto-assign pending orders after fetching
      autoAssignPendingOrders(response.data);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const autoAssignPendingOrders = async (ordersList: Order[]) => {
    const assignPromises = ordersList.map(async (order) => {
      if (order.status === "pending") {
        try {
          const response = await axios.post(`${BACKEND_API}/orders/assign`, {
            orderId: order._id,
            scheduledFor: order.scheduledFor,
          });
  
          const assignedPartnerId = response.data.assignedTo;
   
          // Log the assignment success
          await axios.post(`${BACKEND_API}/assignments/run`, {
            orderId: order._id,
            partnerId: assignedPartnerId ? Number(assignedPartnerId) : null, // Convert to number or send null
            timestamp: new Date().toISOString(),
            status: "success",
          });
          
  
          window.location.reload();
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || "Unknown error";
  
          // Log the assignment failure
          await axios.post(`${BACKEND_API}/assignments/run`, {
            orderId: order._id,
            partnerId: undefined, // Avoids sending null explicitly
            timestamp: new Date().toISOString(),
            status: "failed",
            reason: errorMessage || "Unknown failure",
          });
          
  
          setOrders((prevOrders) =>
            prevOrders.map((orderItem) =>
              orderItem._id === order._id
                ? { ...orderItem, assignmentError: errorMessage }
                : orderItem
            )
          );
        }
      }
    });
  
    await Promise.all(assignPromises); // Ensure all assignments are processed in parallel
  };
  

  // Handle Picked status
  const handlePicked = async (order: Order) => {
    try {
      const response = await axios.put(`${BACKEND_API}/orders/${order._id}/status`, {
        orderId: order._id,
        status: "picked",
        assignedTo: order.assignedTo, // partnerId can be set here if necessary
      });
      fetchOrders(); // Refresh the orders after update
    } catch (error) {
      setError("Failed to mark order as picked");
    }
  };

  // Handle Delivered status
  const handleDelivered = async (order: Order, rating?: number) => {
    try {
      const response = await axios.put(`${BACKEND_API}/orders/${order._id}/status`, {
        orderId: order._id,
        status: "delivered",
        assignedTo: order.assignedTo,
        rating, // Optional rating if provided
      });
      fetchOrders(); // Refresh the orders after update
    } catch (error) {
      setError("Failed to mark order as delivered");
    }
  };
  useEffect(() => {
  
    const filtered = orders.filter((order) =>
      (!statusFilter || order.status.toLowerCase() === statusFilter.toLowerCase()) &&
      (!areaFilter || order.area.toLowerCase().includes(areaFilter.toLowerCase())) &&
      (!dateFilter || new Date(order.createdAt).toISOString().split('T')[0] === dateFilter)

    );
  
  
    setFilteredOrders([...filtered]); // Force re-render
  }, [statusFilter, areaFilter,dateFilter, orders]);
  

  if (loading) return <p className="text-center text-lg font-semibold text-gray-500">Loading orders...</p>;
  if (error) return <p className="text-center text-lg font-semibold text-red-500">{error}</p>;

 
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Orders Dashboard</h2>
      <div className="flex gap-4 mb-4">
        <select
          className="p-2 border rounded-md bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="picked">Picked</option>
          <option value="delivered">Delivered</option>
        </select>

        <input
          type="text"
          className="p-2 border rounded-md"
          placeholder="Filter by Area"
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
        />

<input
  type="date"
  value={dateFilter}
  onChange={(e) => setDateFilter(e.target.value)}
/>

      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Order No.</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Area</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Total Amount</th>
              <th className="py-3 px-4 text-left">Created At</th>
              <th className="py-3 px-4 text-left">Assigned To</th>
              <th className="py-3 px-4 text-left">Scheduled For</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredOrders.length > 0 ? (
  filteredOrders.map((order) => (

                <tr key={order._id} className="border-b">
                  <td className="py-3 px-4">{order.orderNumber}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-md text-gray-500">{order.customerPhone}</p>
                  </td>
                  <td className="py-3 px-4">{order.area}</td>
                  <td className={`py-3 px-4 font-semibold ${order.status === "delivered" ? "text-green-600" : order.status === "picked" ? "text-blue-600" : "text-yellow-600"}`}>{order.status}</td>
                  <td className="py-3 px-4">₹{Number(order.totalAmount || 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-md text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {order.partnerName ? `${order.partnerName} (${order.partnerPhone})` : "Not Assigned"}
                  </td>
                  <td className="py-3 px-4 text-md text-gray-500">{order.scheduledFor}</td>
                  <td className="py-3 px-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </button>
                    {order.status !== "delivered" && (
                    <>
                      {order.status !== "picked" && (
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md mr-2"
                          onClick={() => handlePicked(order)}
                        >
                          Mark as Picked
                        </button>
                      )}
                      {order.status === "picked" && (
                        <button
                          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md"
                          onClick={() => handleDelivered(order)}
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </>
                  )}
                    {order.assignmentError && (
                      <p className="text-red-500 text-sm mt-2">Not Assigned:   {order.assignmentError}</p>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">No orders available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Order Details</h3>
            <p><strong>Order No:</strong> {selectedOrder.orderNumber}</p>
            <p><strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
            <p><strong>Address:</strong> {selectedOrder.customerAddress}</p>
            <h4 className="text-lg font-semibold mt-4">Items:</h4>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Price</th>
                  <th className="border px-2 py-1">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder?.items?.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1">{item.name}</td>
                    <td className="border px-2 py-1">₹{Number(item.price || 0).toFixed(2)}</td>
                    <td className="border px-2 py-1">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2"><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Assigned To:</strong> {selectedOrder.partnerName} ({selectedOrder.partnerPhone})</p>
            <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}  </p>

            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

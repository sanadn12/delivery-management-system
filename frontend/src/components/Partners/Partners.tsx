"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, X, Edit2, Trash2 } from "lucide-react";

interface Partner {
  shiftEnd: string;
  shiftStart: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  currentLoad: number;
  areas: string[];
  rating: number;
  completedOrders: number;
  
}

const PartnersPage = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for adding partner
  const [newPartner, setNewPartner] = useState({ name: "", email: "", phone: "" });

  // State for editing partner
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsEditModalOpen(true);
  };
  // Modal control
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/deliveryPartner/`);
        setPartners(response.data);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/deliveryPartner/${id}`);
      setPartners(partners.filter((partner) => partner.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/deliveryPartner/`,
        newPartner,
        { headers: { "Content-Type": "application/json" } }
      );
      setPartners([...partners, response.data]);
      setNewPartner({ name: "", email: "", phone: "" });
      setIsAddModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!editingPartner) return;
  
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/deliveryPartner/${editingPartner.id}`,
        editingPartner,
        { headers: { "Content-Type": "application/json" } }
      );
  
      // After successfully updating, re-fetch the partners
      const updatedPartnersResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/deliveryPartner/`);
      setPartners(updatedPartnersResponse.data);
  
      setEditingPartner(null);
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  return (
    <div className=" mt-6 min-h-screen bg-blue-200 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl  font-bold text-blue-600">Delivery Partners</h1>
          <button
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={20} /> Add Partner
          </button>
        </div>

        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        {loading && (
          <div className="flex justify-center mt-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {partners.map((partner) => (
  <div key={partner.id} className="bg-white border-1 border-black p-5 shadow-lg rounded-lg hover:shadow-xl transition">
    <h3 className="text-2xl font-semibold text-black">{partner.name}</h3>
    <p className="text-gray-600">📧 {partner.email}</p>
    <p className="text-gray-600">📞 {partner.phone}</p>
    <p className="text-gray-600"><span className="text-black font-semibold">⭐ Rating:</span> {partner.rating}</p>
    <p className="text-gray-600"><span className="text-black font-semibold">Areas:</span> {(partner.areas || []).join(", ")}</p>
    <p className="text-gray-600"><span className="text-black font-semibold">Shift Start:</span> {partner.shiftStart}</p>
    <p className="text-gray-600"><span className="text-black font-semibold">Shift End:</span> {partner.shiftEnd}</p>
    <p className="text-gray-600"><span className="text-black font-semibold">Current Load:</span> {partner.currentLoad}</p>
    <p className="text-gray-600"><span className="text-black font-semibold">Completed Orders:</span> {partner.completedOrders}</p>

    <p className={`text-lg font-medium mt-2 ${partner.status === "active" ? "text-green-500" : "text-red-500"}`}>
                Status: {partner.status === "active" ? "Active" : "Inactive"}
              </p>

    <button
              className="mt-2 bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 transition"
              onClick={() => handleEdit(partner)} // Handle Edit correctly
            >
              <Edit2 size={16} /> Edit
            </button>
    <button
      className="mt-2 ml-2 bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
      onClick={() => handleDelete(partner.id)}
    >
      <Trash2 size={16} /> Delete
    </button>
  </div>
))}

        </div>
      </div>

      {/* Add Partner Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => setIsAddModalOpen(false)}>
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Register New Partner</h2>
            <form onSubmit={handleRegister} className="flex flex-col space-y-4">
              <input type="text" placeholder="Name" className="border rounded-lg p-2" value={newPartner.name} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })} required />
              <input type="email" placeholder="Email" className="border rounded-lg p-2" value={newPartner.email} onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })} required />
              <input type="text" placeholder="Phone" className="border rounded-lg p-2" value={newPartner.phone} onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })} required />
              <button type="submit" className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Register</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Partner Modal */}
      {isEditModalOpen && editingPartner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
          <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => setIsEditModalOpen(false)}>
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Partner</h2>
          <form onSubmit={handleUpdate} className="flex flex-col space-y-4">
  {/* Name */}
  <input 
    type="text" 
    placeholder="Name" 
    className="border rounded-lg p-2" 
    value={editingPartner.name || ""} 
    onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })} 
     
  />

  {/* Email */}
  <input 
    type="email" 
    placeholder="Email" 
    className="border rounded-lg p-2" 
    value={editingPartner.email || ""} 
    onChange={(e) => setEditingPartner({ ...editingPartner, email: e.target.value })} 
     
  />

  {/* Phone */}
  <input 
    type="tel" 
    placeholder="Phone" 
    className="border rounded-lg p-2" 
    value={editingPartner.phone || ""} 
    onChange={(e) => setEditingPartner({ ...editingPartner, phone: e.target.value })} 
     
  />

  {/* Areas Management */}
  <input 
    type="text" 
    placeholder="Areas (comma separated)" 
    className="border rounded-lg p-2" 
    value={(editingPartner.areas || []).join(", ")} 
    onChange={(e) => setEditingPartner({ 
      ...editingPartner, 
      areas: e.target.value ? e.target.value.split(", ") : [] 
    })} 
     
  />

  {/* Shift Start */}
  <label className="text-sm font-medium">Shift Start</label>
  <input 
    type="time" 
    className="border rounded-lg p-2" 
    value={editingPartner.shiftStart || ""} 
    onChange={(e) => setEditingPartner({ ...editingPartner, shiftStart: e.target.value })}
    
  />

  {/* Shift End */}
  <label className="text-sm font-medium">Shift End</label>
  <input 
    type="time" 
    className="border rounded-lg p-2" 
    value={editingPartner.shiftEnd || ""} 
    onChange={(e) => setEditingPartner({ ...editingPartner, shiftEnd: e.target.value })}
    
  />

  {/* Submit Button */}
  <button type="submit" className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
    Update
  </button>
</form>

          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersPage;

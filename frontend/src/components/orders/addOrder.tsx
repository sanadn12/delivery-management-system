"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";


const Button = ({ onClick, children, className }: { onClick?: () => void; children: React.ReactNode; className?: string }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded font-medium transition duration-300 ${className}`}
  >
    {children}
  </button>
);

interface Item {
  name: string;
  quantity: string;
  price: string;
}

interface Order {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  area: string;
  items: Item[];
  scheduledFor: string;
  totalAmount: string;
}

const AddOrder: React.FC = () => {
  const [order, setOrder] = useState<Order>({
    orderNumber: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    area: "",
    items: [{ name: "", quantity: "", price: "" }],
    scheduledFor: "",
    totalAmount: "0",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => {
      const updatedItems = [...prevOrder.items];
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      return { ...prevOrder, items: updatedItems };
    });
  };

  const addItem = () => {
    setOrder((prevOrder) => ({ ...prevOrder, items: [...prevOrder.items, { name: "", quantity: "", price: "" }] }));
  };

  // Auto-calculate the total amount
  useEffect(() => {
    const total = order.items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      return sum + price * quantity;
    }, 0);
    setOrder((prevOrder) => ({ ...prevOrder, totalAmount: total.toFixed(2) }));
  }, [order.items]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedOrder = {
      orderNumber: order.orderNumber,
      customer: {
        name: order.customerName,
        phone: order.customerPhone,
        address: order.customerAddress,
      },
      area: order.area,
      items: order.items,
      scheduledFor: order.scheduledFor,
      totalAmount: parseFloat(order.totalAmount),
    };
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/orders/`, formattedOrder);
      alert("Order added successfully");
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      alert("Error adding order");
    }
  };

  return (
    <div className="flex justify-center mt-12 mb-4">
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-lg px-8 py-4 text-lg font-bold rounded-xl"
      >
        + Add Order
      </Button>
    
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
         
          <div className="bg-white p-6 rounded shadow-md max-w-lg w-full overflow-y-auto max-h-[80vh]">
          <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Add Order</h2>
            
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="orderNumber"
                placeholder="Order Number"
                value={order.orderNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="text"
                name="customerName"
                placeholder="Customer Name"
                value={order.customerName}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="text"
                name="customerPhone"
                placeholder="Customer Phone"
                value={order.customerPhone}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="text"
                name="customerAddress"
                placeholder="Customer Address"
                value={order.customerAddress}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="text"
                name="area"
                placeholder="Delivery Area"
                value={order.area}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
                required
              />
              {order.items.map((item, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full p-2 border rounded mb-2"
                    required
                  />
                  <input
                    type="text"
                    name="quantity"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full p-2 border rounded mb-2"
                    required
                  />
                  <input
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full p-2 border rounded mb-2"
                    required
                  />
                </div>
              ))}
              <Button onClick={addItem} className="w-full bg-gray-200 hover:bg-gray-300">
                + Add Item
              </Button>
              <input
                type="datetime-local"
                name="scheduledFor"
                value={order.scheduledFor}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="text"
                name="totalAmount"
                placeholder="Total Amount"
                value={order.totalAmount}
                readOnly
                className="w-full p-2 border rounded mb-2 bg-gray-100"
              />
              <div className="flex justify-end">
                <Button onClick={() => setIsModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 mr-2">
                  Cancel
                </Button>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddOrder;

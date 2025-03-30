export type Order = {
    _id: string;
    orderNumber: string;
    customer: {
      name: string;
      phone: string;
      address: string;
    };
    area: string;
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
    status: "pending" | "cancelled" | "assigned" | "picked" | "delivered";
    scheduledFor: string; 
    assignedTo?: string; 
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
  };
  
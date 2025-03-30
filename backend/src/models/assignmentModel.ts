export type Assignment = {
  orderId: number; 
  partnerId: number; 
  timestamp: Date; 
  status: "success" | "failed"; 
  reason?: string; 
};

export type AssignmentMetrics = {
  totalAssigned: number;
  successRate: number;
  averageTime: number;
  failureReasons: {
    reason: string;
    count: number;
  }[];
};

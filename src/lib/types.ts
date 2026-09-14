export type Stock = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  buyerName: string;
  stockId: string | null;
  stockName: string;
  quantity: number;
  totalPrice: number;
  description: string | null;
  status: string;
  paymentStatus: string;
  amountPaid: number;
  purchaseCode: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

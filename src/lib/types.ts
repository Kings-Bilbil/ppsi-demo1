export interface Stock {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  buyerName: string;
  stockId: string | null;
  stockName: string;
  quantity: number;
  totalPrice: number;
  description: string | null;
  status: string;
  purchaseCode: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

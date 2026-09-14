"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { Order, Stock } from "@/lib/types";
import { formatIDR } from "@/lib/format";

export function FinancialBarChart({ orders, stocks }: { orders: Order[], stocks: Stock[] }) {
  const data = useMemo(() => {
    // Group orders by month/week or just simple total for now based on status/time
    // Since this is a demo, let's just group by month of creation
    const monthlyMap = new Map<string, { name: string; revenue: number; modal: number }>();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const name = d.toLocaleString('id-ID', { month: 'short' });
      monthlyMap.set(d.getMonth().toString(), { name, revenue: 0, modal: 0 });
    }

    for (const order of orders) {
      const d = new Date(order.createdAt);
      const mKey = d.getMonth().toString();
      if (monthlyMap.has(mKey)) {
        const item = monthlyMap.get(mKey)!;
        item.revenue += order.totalPrice;
        
        // Modal is calculated based on current costPrice of the stock
        const stock = stocks.find(s => s.name === order.stockName);
        if (stock) {
          item.modal += stock.costPrice * order.quantity;
        }
      }
    }
    return Array.from(monthlyMap.values());
  }, [orders, stocks]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E9EFEF] p-3 rounded-lg shadow-lg">
          <p className="text-[#6C7E75] text-xs mb-2">{label}</p>
          <p className="text-blue-600 text-sm font-bold">Pendapatan: {formatIDR(payload[0].value)}</p>
          <p className="text-red-500 text-sm font-bold">Modal: {formatIDR(payload[1].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9EFEF" vertical={false} />
          <XAxis dataKey="name" stroke="#6C7E75" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis 
            stroke="#6C7E75" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `Rp${value / 1000}k`}
          />
          <RechartsTooltip content={<CustomTooltip />} cursor={{fill: '#F4F6F5'}} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: '#6C7E75' }} />
          <Bar dataKey="revenue" name="Pendapatan" fill="#2563EB" radius={[4, 4, 0, 0]} />
          <Bar dataKey="modal" name="Modal" fill="#EF4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PaymentStatusPieChart({ orders }: { orders: Order[] }) {
  const data = useMemo(() => {
    let lunas = 0, dp = 0, belum = 0;
    for (const o of orders) {
      if (o.paymentStatus === "Lunas") lunas++;
      else if (o.paymentStatus === "Sudah DP") dp++;
      else belum++;
    }
    return [
      { name: "Lunas", value: lunas, color: "#22C55E" }, // Emerald
      { name: "Sudah DP", value: dp, color: "#F97316" }, // Orange
      { name: "Belum DP", value: belum, color: "#EF4444" }, // Red
    ].filter(d => d.value > 0);
  }, [orders]);

  if (data.length === 0) {
    return <div className="h-72 flex items-center justify-center text-[#879A91] text-sm">Belum ada data pembayaran</div>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip 
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E9EFEF', borderRadius: '8px', color: '#0B130F', fontWeight: 'bold' }}
            itemStyle={{ color: '#0B130F' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#6C7E75' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

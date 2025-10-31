import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", transactions: 400 },
  { name: "Tue", transactions: 300 },
  { name: "Wed", transactions: 500 },
  { name: "Thu", transactions: 700 },
  { name: "Fri", transactions: 650 },
];

export default function AnalyticsChart() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        Transaction Analytics
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="transactions"
            stroke="#6366f1"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

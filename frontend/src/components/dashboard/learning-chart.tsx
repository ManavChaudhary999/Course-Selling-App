"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"

const data = [
  { day: "mon", hours: 0 },
  { day: "tue", hours: 1.5 },
  { day: "wed", hours: 2.5 },
  { day: "thu", hours: 1 },
  { day: "fri", hours: 4 },
  { day: "sat", hours: 3 },
  { day: "sun", hours: 2 },
]

export function LearningChart() {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="day"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
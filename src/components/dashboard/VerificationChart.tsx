import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface Point {
  label: string
  genuine: number
  counterfeit: number
}

export function VerificationChart({ data }: { data: Point[] }) {
  return (
    <div className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#475569' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#475569' }} width={32} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="genuine" name="Genuine" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
          <Area type="monotone" dataKey="counterfeit" name="Counterfeit" stroke="#DC2626" fill="#DC2626" fillOpacity={0.18} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

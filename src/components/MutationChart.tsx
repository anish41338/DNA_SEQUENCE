import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MutationStats } from '../types/alignment';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface MutationChartProps {
  stats: MutationStats;
}

const COLORS = {
  matches: '#88D498',
  substitutions: '#EF4444',
  insertions: '#4D9DE0',
  deletions: '#8B5CF6',
};

export const MutationChart: React.FC<MutationChartProps> = ({ stats }) => {
  const barData = [
    { name: 'Matches', value: stats.matches, color: COLORS.matches },
    { name: 'Substitutions', value: stats.substitutions, color: COLORS.substitutions },
    { name: 'Insertions', value: stats.insertions, color: COLORS.insertions },
    { name: 'Deletions', value: stats.deletions, color: COLORS.deletions },
  ];

  const pieData = barData.filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-strong border border-neutral-200/50">
        <p className="font-semibold text-neutral-700">{`${name}: ${value}`}</p>
        <p className="text-sm text-neutral-600">
          {((value / stats.total) * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};



  return (
    <div className="bg-gradient-card rounded-2xl shadow-medium border border-neutral-200/50 p-8 animate-slide-up backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-700">Mutation Statistics</h2>
          <p className="text-neutral-600">Visual analysis of sequence variations</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-gradient-secondary rounded-xl p-6 border border-primary-200/30 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-neutral-700">Mutation Counts</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#4A5568' }}
                axisLine={{ stroke: '#CBD5E0' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#4A5568' }}
                axisLine={{ stroke: '#CBD5E0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-gradient-secondary rounded-xl p-6 border border-primary-200/30 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-neutral-700">Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"   // ✅ Add this line
                >

                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-8 border-t border-neutral-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {barData.map((item) => (
            <div key={item.name} className="text-center bg-white/80 p-4 rounded-xl shadow-soft border border-neutral-200/50">
              <div 
                className="w-6 h-6 rounded-full mx-auto mb-2 shadow-soft"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="text-2xl font-bold text-neutral-700">{item.value}</div>
              <div className="text-sm text-neutral-600 font-medium">{item.name}</div>
              <div className="text-xs text-neutral-500 mt-1">
                {((item.value / stats.total) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
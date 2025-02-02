import React from 'react';
import { TrendingUp, BarChart2, Clock, Leaf, Zap } from 'lucide-react';
import { MarketState } from '../types';

interface MarketStatsProps {
  stats: MarketState;
}

export function MarketStats({ stats }: MarketStatsProps) {
  const minPrice = Math.min(...stats.priceHistory.map(p => p.price));
  const maxPrice = Math.max(...stats.priceHistory.map(p => p.price));
  const priceRange = maxPrice - minPrice;
  const padding = 20;
  const width = 100;
  const height = 100;

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-medium">Current Price</h3>
          </div>
          <p className="text-3xl font-bold">${stats.currentPrice.toFixed(3)}</p>
          <p className="text-sm text-gray-500 mt-2">Per kWh</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart2 className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-medium">Trading Volume</h3>
          </div>
          <p className="text-3xl font-bold">{stats.totalVolume.toFixed(1)}</p>
          <p className="text-sm text-gray-500 mt-2">kWh Today</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-medium">Carbon Offset</h3>
          </div>
          <p className="text-3xl font-bold">{stats.carbonOffset.toFixed(1)}</p>
          <p className="text-sm text-gray-500 mt-2">Tons CO₂</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-medium">Network Efficiency</h3>
          </div>
          <p className="text-3xl font-bold">{(stats.networkEfficiency * 100).toFixed(1)}%</p>
          <p className="text-sm text-gray-500 mt-2">Last 24h</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-medium">Last Update</h3>
          </div>
          <p className="text-3xl font-bold">
            {new Date(stats.lastUpdate).toLocaleTimeString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">Local Time</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-medium mb-4">Price History (24h)</h3>
        <div className="h-48 relative">
          <svg 
            viewBox={`0 0 ${width + padding * 2} ${height + padding * 2}`}
            className="w-full h-full overflow-visible"
          >
            {/* Y-axis */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={height + padding}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            
            {/* X-axis */}
            <line
              x1={padding}
              y1={height + padding}
              x2={width + padding}
              y2={height + padding}
              stroke="#e5e7eb"
              strokeWidth="1"
            />

            {/* Price line */}
            <path
              d={stats.priceHistory.map((point, i) => {
                const x = padding + (i / (stats.priceHistory.length - 1)) * width;
                const y = padding + height - ((point.price - minPrice) / priceRange) * height;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />

            {/* Price points */}
            {stats.priceHistory.map((point, i) => {
              const x = padding + (i / (stats.priceHistory.length - 1)) * width;
              const y = padding + height - ((point.price - minPrice) / priceRange) * height;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#3b82f6"
                  />
                  {i % 6 === 0 && (
                    <text
                      x={x}
                      y={height + padding + 15}
                      textAnchor="middle"
                      className="text-xs fill-gray-500"
                    >
                      {new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit' })}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Y-axis labels */}
            <text
              x={padding - 5}
              y={padding}
              textAnchor="end"
              alignmentBaseline="middle"
              className="text-xs fill-gray-500"
            >
              ${maxPrice.toFixed(3)}
            </text>
            <text
              x={padding - 5}
              y={height + padding}
              textAnchor="end"
              alignmentBaseline="middle"
              className="text-xs fill-gray-500"
            >
              ${minPrice.toFixed(3)}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { EnergyForecast } from '../types';

interface AgentForecastProps {
  forecast: EnergyForecast[];
}

export function AgentForecast({ forecast }: AgentForecastProps) {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Energy Forecast</h4>
      <div className="space-y-2">
        {forecast.slice(0, 3).map((f, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {new Date(f.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{f.amount} kWh</span>
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${f.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
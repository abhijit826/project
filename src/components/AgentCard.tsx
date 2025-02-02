import React, { useState } from 'react';
import { Battery, Zap, DollarSign, MapPin, Gauge, Leaf } from 'lucide-react';
import { Agent } from '../types';
import { AgentForecast } from './AgentForecast';

interface AgentCardProps {
  agent: Agent;
  onTrade?: (agent: Agent) => void;
}

export function AgentCard({ agent, onTrade }: AgentCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const energyPercentage = (agent.currentEnergy / agent.energyCapacity) * 100;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{agent.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          agent.status === 'active' ? 'bg-green-100 text-green-800' :
          agent.status === 'trading' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {agent.status}
        </span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Battery className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Energy Level</span>
          </div>
          <div className="w-24 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${energyPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Capacity</span>
          </div>
          <span className="font-medium">{agent.energyCapacity} kWh</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Price</span>
          </div>
          <span className="font-medium">${agent.price}/kWh</span>
        </div>

        {showDetails && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Location</span>
              </div>
              <span className="font-medium">{agent.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Efficiency</span>
              </div>
              <span className="font-medium">{(agent.efficiency * 100).toFixed(1)}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Carbon Footprint</span>
              </div>
              <span className="font-medium">{agent.carbonFootprint} kg/kWh</span>
            </div>

            <AgentForecast forecast={agent.forecast} />
          </>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          {onTrade && (
            <button
              onClick={() => onTrade(agent)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Trade
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Agent, Transaction } from '../types';

interface TradeModalProps {
  agent: Agent;
  marketPrice: number;
  onClose: () => void;
  onTrade: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => void;
  agents: Agent[];
}

export function TradeModal({ agent, marketPrice, onClose, onTrade, agents }: TradeModalProps) {
  const [amount, setAmount] = useState<number>(100);
  const [price, setPrice] = useState<number>(marketPrice);
  const [partner, setPartner] = useState<string>('');

  const potentialPartners = agents.filter(a => 
    a.id !== agent.id && 
    ((agent.type === 'producer' && a.type === 'consumer') ||
     (agent.type === 'consumer' && a.type === 'producer'))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;

    const transaction = {
      sellerId: agent.type === 'producer' ? agent.id : partner,
      buyerId: agent.type === 'consumer' ? agent.id : partner,
      amount,
      price,
      carbonSaved: amount * Math.abs(
        (agents.find(a => a.id === partner)?.carbonFootprint || 0) -
        agent.carbonFootprint
      ),
    };

    onTrade(transaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6">Trade Energy with {agent.name}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trading Partner
            </label>
            <select
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a trading partner</option>
              {potentialPartners.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (kWh)
            </label>
            <input
              type="number"
              min="1"
              max={agent.type === 'producer' ? agent.currentEnergy : agent.energyCapacity - agent.currentEnergy}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per kWh ($)
            </label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Market price: ${marketPrice.toFixed(3)}/kWh
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors"
            >
              Confirm Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { CircuitBoard } from 'lucide-react';
import { Agent, MarketState, Transaction, EnergyForecast } from './types';
import { AgentCard } from './components/AgentCard';
import { MarketStats } from './components/MarketStats';
import { TradeModal } from './components/TradeModal';

// Simulate AI agents
const initialAgents: Agent[] = [
  {
    id: '1',
    name: 'Solar Farm Alpha',
    type: 'producer',
    energyCapacity: 1000,
    currentEnergy: 850,
    price: 0.12,
    status: 'active',
    efficiency: 0.95,
    location: 'Arizona, USA',
    carbonFootprint: 0.02,
    forecast: generateForecast(),
  },
  {
    id: '2',
    name: 'Wind Farm Beta',
    type: 'producer',
    energyCapacity: 800,
    currentEnergy: 600,
    price: 0.14,
    status: 'trading',
    efficiency: 0.92,
    location: 'Texas, USA',
    carbonFootprint: 0.01,
    forecast: generateForecast(),
  },
  {
    id: '3',
    name: 'Industrial Consumer',
    type: 'consumer',
    energyCapacity: 1500,
    currentEnergy: 400,
    price: 0.15,
    status: 'active',
    efficiency: 0.88,
    location: 'Michigan, USA',
    carbonFootprint: 0.08,
    forecast: generateForecast(),
  },
  {
    id: '4',
    name: 'Residential Grid',
    type: 'consumer',
    energyCapacity: 500,
    currentEnergy: 280,
    price: 0.13,
    status: 'idle',
    efficiency: 0.90,
    location: 'California, USA',
    carbonFootprint: 0.05,
    forecast: generateForecast(),
  },
];

function generateForecast(): EnergyForecast[] {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(now.getTime() + i * 3600000),
    amount: Math.round(Math.random() * 100 + 50),
    confidence: Math.random() * 0.3 + 0.7,
  }));
}

const initialMarketState: MarketState = {
  currentPrice: 0.135,
  totalVolume: 2450,
  lastUpdate: new Date(),
  priceHistory: Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000),
    price: 0.13 + Math.random() * 0.02,
  })),
  demandForecast: 3000,
  carbonOffset: 125.5,
  networkEfficiency: 0.93,
};

function App() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [marketState, setMarketState] = useState<MarketState>(initialMarketState);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Simulate market updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketState(prev => {
        const newPrice = prev.currentPrice + (Math.random() - 0.5) * 0.01;
        return {
          ...prev,
          currentPrice: newPrice,
          totalVolume: prev.totalVolume + Math.random() * 10,
          lastUpdate: new Date(),
          priceHistory: [...prev.priceHistory.slice(1), { timestamp: new Date(), price: newPrice }],
          carbonOffset: prev.carbonOffset + Math.random() * 0.1,
          networkEfficiency: Math.min(1, prev.networkEfficiency + (Math.random() - 0.5) * 0.01),
        };
      });

      setAgents(prev => prev.map(agent => ({
        ...agent,
        currentEnergy: Math.min(
          agent.energyCapacity,
          agent.currentEnergy + (Math.random() - 0.5) * 50
        ),
        status: Math.random() > 0.7 ? 
          (['active', 'trading', 'idle'][Math.floor(Math.random() * 3)]) as Agent['status'] 
          : agent.status,
        forecast: agent.forecast.map(f => ({
          ...f,
          amount: f.amount + (Math.random() - 0.5) * 10,
          confidence: Math.max(0.5, Math.min(1, f.confidence + (Math.random() - 0.5) * 0.1)),
        })),
      })));

      // Simulate random transactions
      if (Math.random() > 0.7) {
        const producers = agents.filter(a => a.type === 'producer' && a.currentEnergy > 100);
        const consumers = agents.filter(a => a.type === 'consumer' && a.currentEnergy < a.energyCapacity);
        
        if (producers.length && consumers.length) {
          const seller = producers[Math.floor(Math.random() * producers.length)];
          const buyer = consumers[Math.floor(Math.random() * consumers.length)];
          const amount = Math.min(100, Math.floor(Math.random() * 200));
          
          setTransactions(prev => [{
            id: Date.now().toString(),
            sellerId: seller.id,
            buyerId: buyer.id,
            amount,
            price: marketState.currentPrice,
            timestamp: new Date(),
            status: 'completed',
            carbonSaved: amount * (buyer.carbonFootprint - seller.carbonFootprint),
          }, ...prev.slice(0, 9)]);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [agents]);

  const handleTrade = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleTradeSubmit = (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'completed',
    };

    setTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);

    // Update agent energy levels
    setAgents(prev => prev.map(agent => {
      if (agent.id === transaction.sellerId) {
        return {
          ...agent,
          currentEnergy: agent.currentEnergy - transaction.amount,
          status: 'active',
        };
      }
      if (agent.id === transaction.buyerId) {
        return {
          ...agent,
          currentEnergy: agent.currentEnergy + transaction.amount,
          status: 'active',
        };
      }
      return agent;
    }));

    // Update market state
    setMarketState(prev => ({
      ...prev,
      totalVolume: prev.totalVolume + transaction.amount,
      currentPrice: (prev.currentPrice + transaction.price) / 2,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <CircuitBoard className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Energy Trading Network</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MarketStats stats={marketState} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map(agent => (
            <AgentCard 
              key={agent.id} 
              agent={agent}
              onTrade={handleTrade}
            />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-4">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">
                      {agents.find(a => a.id === tx.sellerId)?.name} →{' '}
                      {agents.find(a => a.id === tx.buyerId)?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600">
                      Carbon Saved: {tx.carbonSaved.toFixed(2)} kg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{tx.amount} kWh</p>
                    <p className="text-sm text-gray-500">
                      ${(tx.amount * tx.price).toFixed(2)}
                    </p>
                    <p className="text-sm text-blue-600">
                      ${tx.price.toFixed(3)}/kWh
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedAgent && (
        <TradeModal
          agent={selectedAgent}
          marketPrice={marketState.currentPrice}
          onClose={() => setSelectedAgent(null)}
          onTrade={handleTradeSubmit}
          agents={agents}
        />
      )}
    </div>
  );
}

export default App;
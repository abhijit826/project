export interface Agent {
  id: string;
  name: string;
  type: 'producer' | 'consumer';
  energyCapacity: number;
  currentEnergy: number;
  price: number;
  status: 'active' | 'trading' | 'idle';
  efficiency: number;
  lastTransaction?: Transaction;
  forecast: EnergyForecast[];
  location: string;
  carbonFootprint: number;
}

export interface Transaction {
  id: string;
  sellerId: string;
  buyerId: string;
  amount: number;
  price: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  carbonSaved: number;
}

export interface MarketState {
  currentPrice: number;
  totalVolume: number;
  lastUpdate: Date;
  priceHistory: { timestamp: Date; price: number }[];
  demandForecast: number;
  carbonOffset: number;
  networkEfficiency: number;
}

export interface EnergyForecast {
  timestamp: Date;
  amount: number;
  confidence: number;
}
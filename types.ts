// src/types.ts

export interface PortfolioItem {
  id: string;
  url: string;
  title: string;
  category: 'Portrait' | 'Magazine' | 'Nature' | 'Neo-Andean';
  description: string;
  articleBody?: string; // Long-form content for magazine pages
  date: string;
}

export interface Message {
  id: string;
  sender: 'client' | 'admin' | 'ai';
  text: string;
  timestamp: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  date: string;
  package: string;
  status: 'pending' | 'confirmed' | 'delivered';
  vaultKey?: string;
  images?: string[]; 
  notes?: string; // For client CRM communication
}

export interface Contract {
  id: string;
  clientName: string;
  date: string;
  totalValue: number;
  signed: boolean;
  signatureData?: string;
}

/**
 * Added to fix the SovereigntyGateway error
 */
export interface TransactionLog {
  id: string;
  type: 'access' | 'change' | 'error';
  message: string;
  timestamp: string;
  details?: string;
}

export type View = 
  | 'home' 
  | 'portfolio' 
  | 'magazine' 
  | 'admin' 
  | 'vault' 
  | 'culling' 
  | 'deals' 
  | 'magazine-editor' 
  | 'booking';
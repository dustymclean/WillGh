// src/types.ts

export interface PortfolioItem {
  id: string;
  url: string;
  title: string;
  category: 'Portrait' | 'Magazine' | 'Nature' | 'Neo-Andean';
  description: string;
  articleBody?: string;
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
  notes?: string; 
}

// --- NEW VAULT INTERFACE ---
export interface Vault {
  id: string;
  created_at: string;
  client_name: string;
  client_email: string;
  vault_key: string; // The secret key for client access
  status: 'active' | 'expired' | 'locked';
  expires_at?: string;
  images: string[]; // Array of URLs to their high-res photos
  booking_id?: string;
}

export interface Contract {
  id: string;
  clientName: string;
  date: string;
  totalValue: number;
  signed: boolean;
  signatureData?: string;
}

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
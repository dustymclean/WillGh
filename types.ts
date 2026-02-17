/**
 * WILL GHRIGSBY PHOTOGRAPHY // SOVEREIGN TYPES
 * Comprehensive type definitions for the Node Archive, Ledger, and Intelligence Hub.
 */

export interface PortfolioItem {
  id: string;
  url: string;
  title: string;
  category: 'Portrait' | 'Magazine' | 'Nature' | 'Neo-Andean';
  description: string;
  articleBody?: string;
  date: string;
  layout?: 'Hero' | 'Grid' | 'Narrative';
}

// --- SOVEREIGN LEDGER (Financial / Total Revenue) ---
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: 'Session' | 'Print' | 'Licensing' | 'Workshop' | 'Other';
  description: string;
  clientId?: string;
  status: 'pending' | 'cleared';
}

// --- SOVEREIGN TO-DO LIST ---
export interface Task {
  id: string;
  task: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Shooting' | 'Editing' | 'Client' | 'Admin';
  status: 'Pending' | 'In Progress' | 'Completed';
  deadline?: string;
}

// --- CLIENT CRM / Frequency Channels ---
export interface ContactChannel {
  type: 'Instagram' | 'WhatsApp' | 'Email' | 'Phone';
  value: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  date: string;
  package: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'lead';
  vaultKey?: string;
  images?: string[]; 
  notes?: string; 
  channels?: ContactChannel[];
  socialIntelligence?: string; 
}

// --- ARTIFACT ARCHIVES (Archive Density) ---
export interface Vault {
  id: string;
  created_at: string;
  client_name: string;
  client_email: string;
  vault_key: string; 
  status: 'active' | 'expired' | 'locked';
  expires_at?: string;
  images: string[]; 
  booking_id?: string;
}

export interface Contract {
  id: string;
  clientName: string;
  date: string;
  totalValue: number;
  signed: boolean;
  signatureData?: string;
  clientId?: string;
}

// --- SYSTEM INTELLIGENCE & DEBUG ---
export interface TransactionLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'SYNC';
  endpoint: string;
  status: 'SUCCESS' | 'SYNCING' | 'ERROR';
  details?: string;
}

export interface Message {
  id: string;
  sender: 'ai' | 'client' | 'admin';
  text: string;
  timestamp: string;
}

// --- METRIC DRILL-DOWN TYPES ---
export interface ArchiveMetric {
  category: string;
  unitCount: number;
  densityScore: number; // For visualization
}

export interface RevenueMetric {
  totalRevenue: number;
  clearedRevenue: number;
  pendingRevenue: number;
  categoryBreakdown: Record<string, number>;
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
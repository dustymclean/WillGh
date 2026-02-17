
import { createClient, RealtimeChannel } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

/**
 * Sovereignty Gateway v6.0 (Resilient Transmission Edition)
 * Features: Automatic Retries, Granular Upserts, Persistent Logging.
 */

const SUPABASE_URL = 'https://aquO5XyyxjgFJ8kJc3NeqQ.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_aquO5XyyxjgFJ8kJc3NeqQ_47w0r-qY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface TransactionLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'SYNC';
  endpoint: string;
  status: 'SUCCESS' | 'SYNCING' | 'ERROR';
  details?: string;
}

class SovereigntyGateway {
  private static instance: SovereigntyGateway;
  private logs: TransactionLog[] = [];
  private onLogUpdate?: (logs: TransactionLog[]) => void;
  private channels: Map<string, RealtimeChannel> = new Map();

  private constructor() {}

  static getInstance() {
    if (!this.instance) this.instance = new SovereigntyGateway();
    return this.instance;
  }

  setLogCallback(cb: (logs: TransactionLog[]) => void) {
    this.onLogUpdate = cb;
    cb(this.logs);
  }

  private async log(method: TransactionLog['method'], endpoint: string, status: TransactionLog['status'] = 'SYNCING', details?: string) {
    const entry: TransactionLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      method,
      endpoint,
      status,
      details
    };
    this.logs = [entry, ...this.logs].slice(0, 50);
    this.onLogUpdate?.([...this.logs]);
    return entry.id;
  }

  private updateLogStatus(id: string, status: TransactionLog['status'], details?: string) {
    const index = this.logs.findIndex(l => l.id === id);
    if (index !== -1) {
      this.logs[index].status = status;
      if (details) this.logs[index].details = details;
      this.onLogUpdate?.([...this.logs]);
    }
  }

  subscribe(table: string, callback: (payload: any) => void) {
    if (this.channels.has(table)) return;

    const channel = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        this.log('SYNC', `RECV:${table}`, 'SUCCESS');
        callback(payload);
      })
      .subscribe();

    this.channels.set(table, channel);
  }

  async fetchData<T>(table: string, initial: T): Promise<T> {
    const logId = await this.log('GET', `/${table}`);
    
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;

      this.updateLogStatus(logId, 'SUCCESS');
      if (data && data.length > 0) {
         localStorage.setItem(`sovereign_${table}`, JSON.stringify(data));
         return data as unknown as T;
      }
      
      const saved = localStorage.getItem(`sovereign_${table}`);
      return saved ? JSON.parse(saved) : initial;
    } catch (error) {
      console.warn(`Sovereign Link [${table}] Falling back to Local Buffer`, error);
      this.updateLogStatus(logId, 'ERROR', (error as Error).message);
      const saved = localStorage.getItem(`sovereign_${table}`);
      return saved ? JSON.parse(saved) : initial;
    }
  }

  /**
   * Resilient Save Protocol with Retries
   * Now handles granular updates to prevent payload overflow.
   */
  async saveData<T>(table: string, data: T, retries = 3): Promise<void> {
    const logId = await this.log('PATCH', `/${table}`);
    
    // Always update local buffer first for "Offline First" capability
    const existingRaw = localStorage.getItem(`sovereign_${table}`);
    let nextData: any = data;
    if (Array.isArray(data)) {
        localStorage.setItem(`sovereign_${table}`, JSON.stringify(data));
    } else {
        // If single object, find and replace in local array
        const existingArr = existingRaw ? JSON.parse(existingRaw) : [];
        const idx = existingArr.findIndex((item: any) => item.id === (data as any).id);
        if (idx !== -1) {
            existingArr[idx] = data;
        } else {
            existingArr.push(data);
        }
        localStorage.setItem(`sovereign_${table}`, JSON.stringify(existingArr));
    }

    const performUpsert = async (attempt: number): Promise<void> => {
      try {
        const payload = Array.isArray(data) ? data : [data];
        
        // Detect potential payload size issues
        const payloadSize = JSON.stringify(payload).length;
        if (payloadSize > 8000000) { // ~8MB threshold
            console.warn("Large Artifact Transmission detected. Payloads over 8MB may time out.");
        }

        const { error } = await supabase.from(table).upsert(payload, { onConflict: 'id' });
        
        if (error) throw error;
        this.updateLogStatus(logId, 'SUCCESS');
      } catch (error) {
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000;
          this.updateLogStatus(logId, 'SYNCING', `Retry ${attempt + 1}/${retries} in ${delay}ms...`);
          await new Promise(res => setTimeout(res, delay));
          return performUpsert(attempt + 1);
        }
        console.error('Sovereign Sync Failure after retries:', error);
        this.updateLogStatus(logId, 'ERROR', (error as Error).message);
        throw error;
      }
    };

    return performUpsert(0);
  }
}

export const db = SovereigntyGateway.getInstance();

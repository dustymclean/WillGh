import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Adjust path based on your file
import type { Vault } from '../types';

export const VaultLogin = ({ onAccess }: { onAccess: (vault: Vault) => void }) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Securely query Supabase for a matching key
    const { data, error: fetchError } = await supabase
      .from('vaults')
      .select('*')
      .eq('vault_key', key.trim())
      .eq('status', 'active') // Only allow active vaults
      .single();

    if (fetchError || !data) {
      setError('Invalid or expired Vault Key. Please check your email or contact support.');
    } else {
      onAccess(data as Vault);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-black/80 border border-gold/30 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Client Vault Access</h2>
      <form onSubmit={handleUnlock} className="space-y-4">
        <input
          type="text"
          placeholder="ENTER YOUR VAULT KEY"
          className="w-full p-3 bg-zinc-900 text-white border border-zinc-700 rounded focus:border-gold"
          value={key}
          onChange={(e) => setKey(e.target.value.toUpperCase())}
        />
        <button 
          disabled={loading}
          className="w-full py-3 bg-gold text-black font-bold rounded hover:bg-yellow-500 transition-colors"
        >
          {loading ? 'UNLOCKING...' : 'OPEN VAULT'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};
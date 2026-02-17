import { useState } from 'react';
import { VaultLogin } from '../components/VaultLogin';
import { VaultGallery } from '../components/VaultGallery';
import type { Vault } from '../types';

export default function VaultPage() {
  const [activeVault, setActiveVault] = useState<Vault | null>(null);

  return (
    <div className="vault-container">
      {!activeVault ? (
        <div className="flex items-center justify-center min-h-screen">
          <VaultLogin onAccess={(vault) => setActiveVault(vault)} />
        </div>
      ) : (
        <VaultGallery vault={activeVault} />
      )}
    </div>
  );
}
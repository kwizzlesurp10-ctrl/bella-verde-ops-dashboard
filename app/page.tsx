'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Clock, Hammer, BarChart3, Lock, LogOut, RefreshCw 
} from 'lucide-react';
import BeeMascot from '../components/BeeMascot';

// Types matching your SwiftData models
interface Client {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  gatePIN: string;
  garageCode: string;
  keyLocation: string;
}

interface Job {
  id: string;
  title: string;
  clientId: string;
  budget: number;
  spent: number;
  status: string;
}

interface TimeEntry {
  id: string;
  clientId: string;
  clockIn: string;
  clockOut?: string;
  hours?: number;
}

const initialClients: Client[] = [
  { id: 'c1', name: 'Maple Grove Residence', address: '1240 Maple Ln, Bloomington, MN', contactPerson: 'Sarah Thompson', contactPhone: '(612) 555-0182', gatePIN: '4821', garageCode: 'A392', keyLocation: 'Under the frog statue by the side gate' },
  { id: 'c2', name: 'Lakeside Estate', address: '8900 Lake Harriet Blvd, Minneapolis, MN', contactPerson: 'Michael Chen', contactPhone: '(612) 555-0291', gatePIN: '7394', garageCode: '', keyLocation: 'Magnetic box on the back fence post' },
];

const initialJobs: Job[] = [
  { id: 'j1', title: 'Spring Cleanup & Mulch', clientId: 'c1', budget: 4850, spent: 3120, status: 'Active' },
  { id: 'j2', title: 'Patio & Hardscape Installation', clientId: 'c2', budget: 12400, spent: 8900, status: 'Active' },
];

const initialTimeEntries: TimeEntry[] = [
  { id: 't1', clientId: 'c1', clockIn: '2026-06-10T08:15:00', clockOut: '2026-06-10T12:45:00' },
  { id: 't2', clientId: 'c2', clockIn: '2026-06-10T09:00:00', clockOut: '2026-06-10T15:30:00' },
];

export default function BellaVerdeDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'jobs' | 'reports'>('dashboard');
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [vaultCode, setVaultCode] = useState('');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Calculate live totals
  const totalHours = timeEntries.reduce((sum, entry) => {
    if (entry.clockOut) {
      const hours = (new Date(entry.clockOut).getTime() - new Date(entry.clockIn).getTime()) / 3600000;
      return sum + hours;
    }
    return sum;
  }, 0);

  const handleUnlockVault = () => {
    if (vaultCode === 'BEE2026' || vaultCode === 'demo') {
      setVaultUnlocked(true);
      setVaultCode('');
    } else {
      alert('Incorrect manager code. Try "BEE2026" for demo.');
    }
  };

  const simulateSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      alert('✅ Synced with iOS app via Supabase (demo)');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#1A1A2E]">
      {/* Top Navbar */}
      <nav className="border-b bg-white dark:bg-[#252A3A] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <BeeMascot size={42} />
              <div>
                <div className="font-semibold text-2xl tracking-tight text-[#2D6A4F]">Bella Verde</div>
                <div className="text-xs text-[#40916C] -mt-1">OPERATIONS</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm px-4 py-1.5 rounded-full bg-[#E8F5E9] dark:bg-[#1F2A1F] text-[#2D6A4F]">
              <div className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
              {syncStatus === 'synced' ? 'Synced with iOS' : 'Syncing...'}
            </div>
            
            <button 
              onClick={simulateSync}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#374151] border text-sm hover:bg-[#F8F9FA]"
            >
              <RefreshCw className="w-4 h-4" /> Sync Now
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right text-sm">
                <div className="font-medium">Maria Lopez</div>
                <div className="text-xs text-[#40916C]">Operations Manager</div>
              </div>
              <button className="p-2 rounded-full hover:bg-[#F8F9FA]"><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'clients', label: 'Clients & Properties', icon: Users },
            { id: 'jobs', label: 'Jobs & Tracking', icon: Hammer },
            { id: 'reports', label: 'Labor Reports', icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 flex items-center gap-2 text-sm font-medium rounded-t-xl transition-all ${activeTab === tab.id ? 'bg-white dark:bg-[#252A3A] border-b-2 border-[#2D6A4F] text-[#2D6A4F]' : 'text-[#6B7280] hover:text-[#2D6A4F]'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-sm text-[#40916C] font-medium tracking-widest">TODAY • JUNE 11, 2026</div>
                  <div className="text-4xl font-semibold mt-1">Good afternoon, Maria</div>
                </div>
                <BeeMascot size={72} />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="p-5 bg-[#E8F5E9] rounded-2xl">
                  <div className="text-3xl font-semibold text-[#2D6A4F]">{totalHours.toFixed(1)}</div>
                  <div className="text-sm text-[#40916C]">Total Hours Logged</div>
                </div>
                <div className="p-5 bg-white rounded-2xl border">
                  <div className="text-3xl font-semibold">{jobs.length}</div>
                  <div className="text-sm text-[#6B7280]">Active Jobs</div>
                </div>
                <div className="p-5 bg-white rounded-2xl border">
                  <div className="text-3xl font-semibold text-[#D4A373]">{clients.length}</div>
                  <div className="text-sm text-[#6B7280]">Properties Managed</div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="font-semibold mb-4 flex items-center gap-2"><Lock className="w-4 h-4" /> Quick Secure Access</div>
              <p className="text-sm text-[#6B7280] mb-4">Vault access for field crews is protected on iOS. Use manager override here.</p>
              <button onClick={() => setActiveTab('clients')} className="w-full py-3 rounded-xl bg-[#2D6A4F] text-white font-medium">Open Client Vaults</button>
            </div>
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
          <div>
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-semibold">Properties & Clients</h2>
              <button className="px-5 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-sm font-medium">+ Add New Property</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clients.map(client => (
                <div key={client.id} className="card p-6 cursor-pointer hover:shadow-md" onClick={() => { setSelectedClient(client); setVaultUnlocked(false); }}>
                  <div className="font-semibold text-xl">{client.name}</div>
                  <div className="text-[#6B7280] mt-1">{client.address}</div>
                  <div className="mt-4 text-sm">Contact: {client.contactPerson} • {client.contactPhone}</div>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E]">
                    <Lock className="w-3 h-3" /> Secure Vault Available
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {jobs.map(job => {
              const client = clients.find(c => c.id === job.clientId);
              const progress = Math.min((job.spent / job.budget) * 100, 100);
              return (
                <div key={job.id} className="card p-8">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold text-2xl">{job.title}</div>
                      <div className="text-[#6B7280]">{client?.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-semibold tabular-nums">${job.spent.toLocaleString()}</div>
                      <div className="text-sm text-[#6B7280]">of ${job.budget.toLocaleString()} budget</div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-3 bg-[#2D6A4F] rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between text-xs mt-1.5 text-[#6B7280]">
                      <div>{progress.toFixed(0)}% spent</div>
                      <div>Remaining: $${(job.budget - job.spent).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="card p-8">
            <h3 className="text-2xl font-semibold mb-6">Labor Hours by Property</h3>
            <div className="space-y-4">
              {clients.map(client => {
                const clientHours = timeEntries
                  .filter(e => e.clientId === client.id && e.clockOut)
                  .reduce((sum, e) => {
                    const h = (new Date(e.clockOut!).getTime() - new Date(e.clockIn).getTime()) / 3600000;
                    return sum + h;
                  }, 0);
                return (
                  <div key={client.id} className="flex justify-between items-center p-4 bg-[#F8F9FA] dark:bg-[#1F2A1F] rounded-2xl">
                    <div>{client.name}</div>
                    <div className="font-mono text-xl font-medium text-[#2D6A4F]">{clientHours.toFixed(1)} hrs</div>
                  </div>
                );
              })}
              <div className="pt-4 border-t flex justify-between font-semibold text-lg">
                <div>Total Labor Hours</div>
                <div>{totalHours.toFixed(1)} hrs</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Secure Vault Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]" onClick={() => setSelectedClient(null)}>
          <div className="bg-white dark:bg-[#252A3A] rounded-3xl w-full max-w-md p-8 m-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="font-semibold text-2xl">{selectedClient.name}</div>
                <div className="text-sm text-[#6B7280]">Secure Property Access Vault</div>
              </div>
              <button onClick={() => { setSelectedClient(null); setVaultUnlocked(false); }} className="text-2xl">×</button>
            </div>

            {!vaultUnlocked ? (
              <div>
                <p className="text-sm text-[#6B7280] mb-4">This information is restricted. Enter manager override code to view gate codes and key locations.</p>
                <input 
                  type="password" 
                  placeholder="Manager Code (demo: BEE2026)" 
                  className="w-full border rounded-2xl px-4 py-3 text-lg tracking-widest"
                  value={vaultCode}
                  onChange={(e) => setVaultCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlockVault()}
                />
                <button onClick={handleUnlockVault} className="mt-4 w-full py-4 rounded-2xl bg-[#2D6A4F] text-white font-semibold">Unlock Vault</button>
              </div>
            ) : (
              <div className="space-y-6 text-sm">
                <div><span className="font-medium block text-[#6B7280]">Gate PIN</span> {selectedClient.gatePIN}</div>
                <div><span className="font-medium block text-[#6B7280]">Garage Code</span> {selectedClient.garageCode || '—'}</div>
                <div><span className="font-medium block text-[#6B7280]">Key Location</span> {selectedClient.keyLocation}</div>
                <button onClick={() => setVaultUnlocked(false)} className="text-red-600 text-xs">Lock Vault</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
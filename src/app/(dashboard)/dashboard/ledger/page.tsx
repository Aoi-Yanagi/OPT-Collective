'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import {
  IndianRupee,
  TrendingUp,
  Printer,
  FileSpreadsheet,
  Plus,
} from 'lucide-react';

interface DailyInteractionLogItem {
  id: string;
  timeIst: string;
  category: 'ORDER_SNAPSHOT' | 'QR_VERIFICATION' | 'SUPPLIER_DISPATCH' | 'CATALOG_SYNC' | 'BOT_ALERT';
  summary: string;
  revenueImpactInr: number;
  supplierCostInr: number;
  netMarginInr: number;
}

const INITIAL_DAILY_LOGS: DailyInteractionLogItem[] = [
  {
    id: 'LOG-01',
    timeIst: '10:30 AM',
    category: 'ORDER_SNAPSHOT',
    summary: '[DEMO] Order OPT-2026-DEMO-9012 created (AeroLift 6-Axis Stand × 1)',
    revenueImpactInr: 599,
    supplierCostInr: 190,
    netMarginInr: 409,
  },
  {
    id: 'LOG-02',
    timeIst: '10:45 AM',
    category: 'QR_VERIFICATION',
    summary: '[DEMO] Payment confirmed via Verification Slot (Ref: DEMO-UTR-430411009988)',
    revenueImpactInr: 0,
    supplierCostInr: 0,
    netMarginInr: 0,
  },
  {
    id: 'LOG-03',
    timeIst: '11:15 AM',
    category: 'CATALOG_SYNC',
    summary: 'Meta Commerce & WhatsApp Catalog CSV Feed synced (6 Active SKUs)',
    revenueImpactInr: 0,
    supplierCostInr: 0,
    netMarginInr: 0,
  },
];

export default function LedgerAndDailyPdfReportPage() {
  const [logs, setLogs] = useState<DailyInteractionLogItem[]>(INITIAL_DAILY_LOGS);
  const [noteInput, setNoteInput] = useState<string>('');
  const reportDate = new Date().toISOString().slice(0, 10);

  const totalRevenue = logs.reduce(
    (s: number, i: DailyInteractionLogItem) => s + i.revenueImpactInr,
    0
  );
  const totalSupplierCost = logs.reduce(
    (s: number, i: DailyInteractionLogItem) => s + i.supplierCostInr,
    0
  );
  const totalNetProfit = logs.reduce(
    (s: number, i: DailyInteractionLogItem) => s + i.netMarginInr,
    0
  );

  function handleAddManualLog(e: React.FormEvent) {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const nowTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setLogs((prev: DailyInteractionLogItem[]) => [
      ...prev,
      {
        id: `LOG-0${prev.length + 1}`,
        timeIst: nowTime,
        category: 'SUPPLIER_DISPATCH',
        summary: noteInput.trim(),
        revenueImpactInr: 0,
        supplierCostInr: 0,
        netMarginInr: 0,
      },
    ]);
    setNoteInput('');
  }

  return (
    <div className="space-y-8">
      {/* Top Action Bar (Hidden when printing PDF) */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <span className="font-mono text-xs font-bold uppercase text-theme-accent">
            DAILY INTERACTIONS ARCHIVE &amp; PROFIT-MARGIN LEDGER
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-theme-text">
            Daily Operations Dossier ({reportDate})
          </h1>
        </div>

        <Button variant="primary" size="md" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          <span>Download / Save Daily Interactions PDF ({reportDate})</span>
        </Button>
      </div>

      {/* Printable PDF Dossier Container */}
      <GlassCard className="p-6 space-y-6 print:border-black print:bg-white print:text-black">
        <div className="flex items-center justify-between border-b border-theme-border pb-4">
          <div>
            <h2 className="font-mono text-lg font-black text-theme-text">
              THE O.P.T. COLLECTIVE — DAILY INTERACTIONS &amp; FINANCIAL LEDGER
            </h2>
            <p className="font-mono text-xs text-theme-muted">
              Report Date: {reportDate} • Confidential Internal Merchant Archive
            </p>
          </div>
          <FileSpreadsheet className="h-6 w-6 text-theme-accent" />
        </div>

        {/* KPI Summary Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="opt-matte-surface p-4">
            <span className="font-mono text-xs text-theme-muted">Verified Gross Sales</span>
            <p className="mt-1 flex items-center text-xl font-black text-theme-text">
              <IndianRupee className="h-4 w-4 text-theme-accent" />
              {totalRevenue}
            </p>
          </div>

          <div className="opt-matte-surface p-4">
            <span className="font-mono text-xs text-theme-muted">Supplier Procurement Cost</span>
            <p className="mt-1 flex items-center text-xl font-black text-theme-text">
              <IndianRupee className="h-4 w-4 text-sky-400" />
              {totalSupplierCost}
            </p>
          </div>

          <div className="opt-matte-surface p-4">
            <span className="font-mono text-xs text-theme-muted">Realized Net Profit Margin</span>
            <p className="mt-1 flex items-center text-xl font-black text-emerald-400">
              <TrendingUp className="mr-1 h-4 w-4" />₹{totalNetProfit}
            </p>
          </div>
        </div>

        {/* Chronological Daily Interactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-theme-border font-mono text-[11px] text-theme-muted">
                <th className="pb-2.5 pr-3">Log ID</th>
                <th className="pb-2.5 pr-3">Time (IST)</th>
                <th className="pb-2.5 pr-3">Event Category</th>
                <th className="pb-2.5 pr-3">Operational Interaction Summary</th>
                <th className="pb-2.5 pr-3">Gross (₹)</th>
                <th className="pb-2.5 pr-3">Cost (₹)</th>
                <th className="pb-2.5">Net Profit (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border">
              {logs.map((row: DailyInteractionLogItem) => (
                <tr key={row.id}>
                  <td className="py-2.5 pr-3 font-mono font-bold text-theme-accent">
                    {row.id}
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-theme-muted">{row.timeIst}</td>
                  <td className="py-2.5 pr-3 font-mono text-[11px]">{row.category}</td>
                  <td className="py-2.5 pr-3 text-theme-text">{row.summary}</td>
                  <td className="py-2.5 pr-3 font-mono">
                    {row.revenueImpactInr > 0 ? `₹${row.revenueImpactInr}` : '—'}
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-theme-muted">
                    {row.supplierCostInr > 0 ? `₹${row.supplierCostInr}` : '—'}
                  </td>
                  <td className="py-2.5 font-mono font-bold text-emerald-400">
                    {row.netMarginInr > 0 ? `+₹${row.netMarginInr}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Log Entry Form (Hidden in PDF Print) */}
        <form
          onSubmit={handleAddManualLog}
          className="flex gap-2 border-t border-theme-border pt-4 print:hidden"
        >
          <input
            placeholder="Log a manual supplier interaction, return note, or dispatch update for today's PDF..."
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            className="flex-1 rounded-lg border border-theme-border bg-black/40 px-3 py-2 text-xs text-theme-text"
          />
          <Button type="submit" variant="outline" size="sm">
            <Plus className="h-3.5 w-3.5" />
            <span>Append to Today&apos;s Log</span>
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
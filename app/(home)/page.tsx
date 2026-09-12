'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Share2,
  Copy,
  Check,
  Wifi,
  WifiOff,
  MousePointer2,
  Layers,
  Zap,
  ShieldCheck,
  Users,
  Database,
  RotateCcw,
  Play,
  Activity,
  GitBranch,
  Briefcase,
  Mail,
  Cpu,
  TrendingUp,
  Sparkles,
  LayoutTemplate,
  ArrowRight,
  File,
} from 'lucide-react';

interface CrdtOp {
  id: string;
  type: 'INSERT' | 'DELETE';
  siteId: 'peer-A' | 'peer-B';
  char: string;
  pos: number;
  clock: number;
  vectorClock: { 'peer-A': number; 'peer-B': number };
  timestamp: number;
}

export default function HomePage() {
  const [textA, setTextA] = useState('Real-time collaboration with zero merge conflicts.');
  const [textB, setTextB] = useState('Real-time collaboration with zero merge conflicts.');

  const [vectorClockA, setVectorClockA] = useState({ 'peer-A': 6, 'peer-B': 0 });
  const [vectorClockB, setVectorClockB] = useState({ 'peer-A': 6, 'peer-B': 0 });

  const [isPeerBOnline, setIsPeerBOnline] = useState(true);
  const [simulatedLatency, setSimulatedLatency] = useState(60);

  const [pendingQueueAtoB, setPendingQueueAtoB] = useState<CrdtOp[]>([]);
  const [pendingQueueBtoA, setPendingQueueBtoA] = useState<CrdtOp[]>([]);

  const [operationsLog, setOperationsLog] = useState<CrdtOp[]>([
    {
      id: 'op-1',
      type: 'INSERT',
      siteId: 'peer-A',
      char: 'R',
      pos: 0,
      clock: 1,
      vectorClock: { 'peer-A': 1, 'peer-B': 0 },
      timestamp: Date.now() - 9000,
    },
    {
      id: 'op-2',
      type: 'INSERT',
      siteId: 'peer-A',
      char: 'e',
      pos: 1,
      clock: 2,
      vectorClock: { 'peer-A': 2, 'peer-B': 0 },
      timestamp: Date.now() - 7500,
    },
    {
      id: 'op-3',
      type: 'INSERT',
      siteId: 'peer-B',
      char: 'a',
      pos: 2,
      clock: 1,
      vectorClock: { 'peer-A': 2, 'peer-B': 1 },
      timestamp: Date.now() - 4000,
    },
  ]);

  const [convergencePulse, setConvergencePulse] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'react' | 'ts' | 'vue'>('react');
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const isConverged = useMemo(() => textA === textB, [textA, textB]);

  const handleInputA = (val: string) => {
    const tick = vectorClockA['peer-A'] + 1;
    const nextVC = { ...vectorClockA, 'peer-A': tick };
    setVectorClockA(nextVC);

    const isInsert = val.length >= textA.length;
    const char = isInsert ? val[val.length - 1] || ' ' : '⌫';

    const op: CrdtOp = {
      id: `op-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      type: isInsert ? 'INSERT' : 'DELETE',
      siteId: 'peer-A',
      char,
      pos: val.length,
      clock: tick,
      vectorClock: nextVC,
      timestamp: Date.now(),
    };

    setTextA(val);
    setOperationsLog((prev) => [op, ...prev.slice(0, 19)]);

    if (!isPeerBOnline) {
      setPendingQueueAtoB((prev) => [...prev, op]);
    } else {
      setTimeout(() => {
        setTextB(val);
        setVectorClockB((vcB) => ({
          ...vcB,
          'peer-A': Math.max(vcB['peer-A'], nextVC['peer-A']),
        }));
      }, simulatedLatency);
    }
  };

  const handleInputB = (val: string) => {
    const tick = vectorClockB['peer-B'] + 1;
    const nextVC = { ...vectorClockB, 'peer-B': tick };
    setVectorClockB(nextVC);

    const isInsert = val.length >= textB.length;
    const char = isInsert ? val[val.length - 1] || ' ' : '⌫';

    const op: CrdtOp = {
      id: `op-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      type: isInsert ? 'INSERT' : 'DELETE',
      siteId: 'peer-B',
      char,
      pos: val.length,
      clock: tick,
      vectorClock: nextVC,
      timestamp: Date.now(),
    };

    setTextB(val);
    setOperationsLog((prev) => [op, ...prev.slice(0, 19)]);

    if (!isPeerBOnline) {
      setPendingQueueBtoA((prev) => [...prev, op]);
    } else {
      setTimeout(() => {
        setTextA(val);
        setVectorClockA((vcA) => ({
          ...vcA,
          'peer-B': Math.max(vcA['peer-B'], nextVC['peer-B']),
        }));
      }, simulatedLatency);
    }
  };

  const toggleOfflineMode = () => {
    if (isPeerBOnline) {
      setIsPeerBOnline(false);
    } else {
      setIsPeerBOnline(true);
      setConvergencePulse(true);

      setTimeout(() => {
        const merged = `${textA.trim()} · ${textB.replace(textA, '').trim() || '[Synced Tokyo changes]'}`.replace(/\s+/g, ' ');
        setTextA(merged);
        setTextB(merged);

        const newVC = {
          'peer-A': Math.max(vectorClockA['peer-A'], vectorClockB['peer-A']) + 1,
          'peer-B': Math.max(vectorClockA['peer-B'], vectorClockB['peer-B']) + 1,
        };
        setVectorClockA(newVC);
        setVectorClockB(newVC);
        setPendingQueueAtoB([]);
        setPendingQueueBtoA([]);

        setOperationsLog((prev) => [
          {
            id: `sync-${Date.now()}`,
            type: 'INSERT',
            siteId: 'peer-B',
            char: '⚡ CONVERGE',
            pos: merged.length,
            clock: newVC['peer-B'],
            vectorClock: newVC,
            timestamp: Date.now(),
          },
          ...prev,
        ]);
      }, simulatedLatency + 50);

      setTimeout(() => setConvergencePulse(false), 1400);
    }
  };

  const triggerScenario = (type: 'race' | 'offline' | 'reset') => {
    if (type === 'race') {
      const aVal = '⚡ ' + textA;
      const bVal = '🚀 ' + textB;
      setTextA(aVal);
      setTextB(bVal);
      setTimeout(() => {
        const converged = '⚡ 🚀 ' + textA.replace(/^[⚡🚀\s]+/, '');
        setTextA(converged);
        setTextB(converged);
        setConvergencePulse(true);
        setTimeout(() => setConvergencePulse(false), 1200);
      }, simulatedLatency + 80);
    } else if (type === 'offline') {
      setIsPeerBOnline(false);
      setTextA('[SF Peer]: Editing section 1.');
      setTextB('[Tokyo Peer]: Offline annotations.');
      setPendingQueueBtoA([
        {
          id: 'q-1',
          type: 'INSERT',
          siteId: 'peer-B',
          char: 'Tokyo',
          pos: 0,
          clock: 4,
          vectorClock: { ...vectorClockB },
          timestamp: Date.now(),
        },
      ]);
    } else if (type === 'reset') {
      const base = 'Real-time collaboration with zero merge conflicts.';
      setTextA(base);
      setTextB(base);
      setIsPeerBOnline(true);
      setPendingQueueAtoB([]);
      setPendingQueueBtoA([]);
    }
  };

  const copyToClipboard = (str: string, isCode = false) => {
    navigator.clipboard.writeText(str);
    if (isCode) {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } else {
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 font-sans selection:bg-indigo-500/15 selection:text-indigo-950 antialiased overflow-x-hidden">
      {/* Background ambient pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.2) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 flex items-center justify-center text-white shadow-sm shadow-slate-900/20">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-900 tracking-tight">
              Converge<span className="text-indigo-600">CRDT</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-medium border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>v2.4 Engine Active</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#templates" className="hover:text-slate-900 transition flex items-center gap-1"><Sparkles className="w-3 h-3 text-indigo-500" /> Templates</a>
            <a href="#playground" className="hover:text-slate-900 transition">Playground</a>
            <a href="#dag-stream" className="hover:text-slate-900 transition">Causal Stream</a>
            <a href="#architecture" className="hover:text-slate-900 transition">Architecture</a>
            <a href="#code" className="hover:text-slate-900 transition">SDK Integration</a>
            <a href="#benchmarks" className="hover:text-slate-900 transition">Benchmarks</a>
            <a href="#pricing" className="hover:text-slate-900 transition">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-xs transition"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>14.8k</span>
            </a>
            <a
              href="#code"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-xl shadow-sm shadow-slate-950/20 transition active:scale-[0.98]"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-slate-700 text-xs font-medium tracking-wide mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Local-First &bull; Sub-Millisecond Sync &bull; Zero Central Locks</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.12]">
          Real-Time Collaboration <br />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-slate-900 bg-clip-text text-transparent">
            Without Merge Conflicts.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The collaborative protocol powering modern multiplayer documents, infinite whiteboards, 
          and pair programming tools with deterministic sequence CRDTs.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/documents/doc-welcome"
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-sm shadow-slate-950/20 hover:-translate-y-0.5 transition flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Open Document Editor</span>
          </Link>

          <a
            href="#templates"
            className="px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200/80 hover:-translate-y-0.5 transition flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Browse Templates</span>
          </a>

          <a
            href="#playground"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200/80 shadow-xs hover:-translate-y-0.5 transition flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>CRDT Sandbox</span>
          </a>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 font-mono text-xs text-slate-700 shadow-xs">
            <span className="text-slate-400">$</span>
            <span>npm i @converge/crdt</span>
            <button
              onClick={() => copyToClipboard('npm i @converge/crdt')}
              className="ml-2 text-slate-400 hover:text-slate-900 transition"
              title="Copy to clipboard"
            >
              {copiedInstall ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Dual-Peer Sandbox */}
        <div id="playground" className="mt-14 text-left">
          <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Dual-Peer CRDT Sandbox</div>
                  <div className="text-[10px] text-slate-400">Live deterministic causal convergence</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    isConverged
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : 'bg-amber-50 text-amber-700 border-amber-200/60'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isConverged ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
                  <span>{isConverged ? 'State Converged (100% In Sync)' : 'Diverged (Network Partition Active)'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-500 font-mono">
                <span>Latency:</span>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="20"
                  value={simulatedLatency}
                  onChange={(e) => setSimulatedLatency(Number(e.target.value))}
                  className="w-16 accent-slate-900 cursor-pointer"
                />
                <span className="text-slate-900 min-w-[34px]">{simulatedLatency}ms</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/70">
              {/* Peer A Editor */}
              <div className="p-5 flex flex-col bg-white">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                      AL
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900">Peer A</span>
                      <span className="text-[11px] text-slate-400 ml-1.5">(Alex &bull; San Francisco)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {pendingQueueAtoB.length > 0 ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        {pendingQueueAtoB.length} queued
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        synced
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/60">
                      VC: {'{'} A:{vectorClockA['peer-A']}, B:{vectorClockA['peer-B']} {'}'}
                    </span>
                  </div>
                </div>

                <div className="relative min-h-[140px]">
                  <textarea
                    value={textA}
                    onChange={(e) => handleInputA(e.target.value)}
                    placeholder="Type in Peer A..."
                    className={`w-full h-32 bg-[#fafbfc] text-slate-800 font-mono text-xs leading-relaxed p-3 outline-none resize-none rounded-xl border border-slate-200/70 focus:border-indigo-500/50 transition-all ${
                      convergencePulse ? 'ring-2 ring-emerald-500/40 bg-emerald-50/20' : ''
                    }`}
                    spellCheck={false}
                  />

                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-[10px] text-rose-700 font-semibold pointer-events-none">
                    <MousePointer2 className="w-2.5 h-2.5 fill-current" />
                    <span>Sarah Jenkins typing...</span>
                  </div>
                </div>
              </div>

              {/* Peer B Editor */}
              <div className="p-5 flex flex-col bg-white">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                      SJ
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900">Peer B</span>
                      <span className="text-[11px] text-slate-400 ml-1.5">(Sarah &bull; Tokyo)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {pendingQueueBtoA.length > 0 ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        {pendingQueueBtoA.length} queued
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        synced
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/60">
                      VC: {'{'} A:{vectorClockB['peer-A']}, B:{vectorClockB['peer-B']} {'}'}
                    </span>
                  </div>
                </div>

                <div className="relative min-h-[140px]">
                  <textarea
                    value={textB}
                    onChange={(e) => handleInputB(e.target.value)}
                    placeholder="Type in Peer B..."
                    className={`w-full h-32 bg-[#fafbfc] text-slate-800 font-mono text-xs leading-relaxed p-3 outline-none resize-none rounded-xl border border-slate-200/70 focus:border-rose-500/50 transition-all ${
                      convergencePulse ? 'ring-2 ring-emerald-500/40 bg-emerald-50/20' : ''
                    }`}
                    spellCheck={false}
                  />

                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[10px] text-indigo-700 font-semibold pointer-events-none">
                    <MousePointer2 className="w-2.5 h-2.5 fill-current" />
                    <span>Alex typing...</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Presets:</span>
                <button
                  onClick={() => triggerScenario('race')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  ⚡ Race Condition
                </button>
                <button
                  onClick={() => triggerScenario('offline')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  🔀 Offline Diverge
                </button>
                <button
                  onClick={() => triggerScenario('reset')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                  ↺ Reset
                </button>
              </div>

              <button
                onClick={toggleOfflineMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  isPeerBOnline
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 shadow-xs'
                }`}
              >
                {isPeerBOnline ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>Disconnect Peer B</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5" />
                    <span>Reconnect & Flush Deltas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          TEMPLATES GALLERY SECTION
          ===================================================================== */}
      <section id="templates" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Production-Ready Layouts</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Start with a Modern Template
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            Jumpstart your collaborative documents with curated formats for engineering specs, formal leave requests, tech resumes, and team syncs.
          </p>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Resume */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-full border border-indigo-200/60">
                  Professional
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                Modern Software Engineer Resume
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Clean ATS-friendly tech CV with experience bullets, skills matrix table, and education.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-600 mb-4 line-clamp-3 leading-normal">
                Alex Rivera &bull; Senior Software Engineer &bull; SF, CA &bull; Core Skills &bull; Work Experience...
              </div>
            </div>
            <a
              href="/documents/doc-resume?template=resume"
              className="w-full py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs group-hover:shadow-indigo-500/20"
            >
              <span>Use This Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Leave Letter */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Corporate
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                Formal Leave Application
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Corporate formal leave letter with leave dates schedule, coverage delegation, and contact info.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-600 mb-4 line-clamp-3 leading-normal">
                Application for Planned Annual Leave &bull; Schedule & Coverage Plan Table &bull; Handover notes...
              </div>
            </div>
            <a
              href="/documents/doc-leave?template=leave-letter"
              className="w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Use This Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Software RFC */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-violet-300 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-50/80 px-2 py-0.5 rounded-full border border-violet-200/60">
                  Engineering
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                Software Architecture RFC
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Technical design RFC with problem statement, system architecture table, security, and milestones.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-600 mb-4 line-clamp-3 leading-normal">
                RFC-104: Real-Time CRDT State Sync Protocol &bull; Architecture & Data Flow &bull; Milestones...
              </div>
            </div>
            <a
              href="/documents/doc-rfc?template=software-rfc"
              className="w-full py-2.5 bg-slate-900 hover:bg-violet-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Use This Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4: Meeting Notes */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-full border border-blue-200/60">
                  Management
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                Meeting Notes & Action Items
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Structured team sync with attendee list, numbered agenda, decisions, and assigned action item table.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-600 mb-4 line-clamp-3 leading-normal">
                Attendees: Alex, Sarah, Marcus &bull; Agenda &bull; Key Decisions &bull; Action Items with Owners...
              </div>
            </div>
            <a
              href="/documents/doc-meeting?template=meeting-notes"
              className="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Use This Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 5: Weekly Status Report */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-full border border-amber-200/60">
                  Management
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                Weekly Project Status Report
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Sprint status report with milestone health traffic-lights (On Track, At Risk), blockers, and priorities.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-600 mb-4 line-clamp-3 leading-normal">
                Executive Summary &bull; Milestone Health Matrix &bull; Key Accomplishments &bull; Blockers...
              </div>
            </div>
            <a
              href="/documents/doc-report?template=weekly-report"
              className="w-full py-2.5 bg-slate-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Use This Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 6: Blank Document */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <File className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  Blank Slate
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                Blank Canvas Document
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Distraction-free blank document ready for customized writing, notes, and collaborative ideation.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-500 mb-4 line-clamp-3 leading-normal">
                Untitled Document &bull; Clean canvas ready for typing or pressing '/' for commands...
              </div>
            </div>
            <a
              href="/documents/doc-new?template=blank"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Start Blank</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Causal Stream */}
      <section id="dag-stream" className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Causal Operation Stream
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Each mutation generates an immutable causal operation with fractional vector tokens.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-xs overflow-hidden">
          <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-200/60 flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-700">
              Live Operations Buffer ({operationsLog.length} events logged)
            </span>
            <button
              onClick={() => setOperationsLog([])}
              className="text-[11px] text-slate-500 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-200/60 transition"
            >
              Clear Feed
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto font-mono text-xs">
            {operationsLog.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">No operations logged. Type above to record.</div>
            ) : (
              operationsLog.map((op) => (
                <div key={op.id} className="p-3 flex items-center justify-between hover:bg-slate-50/60 transition">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        op.siteId === 'peer-A' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {op.siteId === 'peer-A' ? 'Peer A' : 'Peer B'}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${op.type === 'INSERT' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {op.type}
                    </span>
                    <span className="text-slate-800 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                      {op.char}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                    <span>Pos: {op.pos}</span>
                    <span>Tick: #{op.clock}</span>
                    <span className="text-slate-500 font-mono">
                      VC: {'{'} A:{op.vectorClock['peer-A']}, B:{op.vectorClock['peer-B']} {'}'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Engineered for Scale
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Mathematical commutativity replaces centralized server bottlenecks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: '0ms Local Latency',
              desc: 'Edits update in-memory state at 60fps with zero perceived network roundtrip delay.',
              icon: <Zap className="w-5 h-5 text-indigo-600" />,
            },
            {
              title: 'RLE Delta Compression',
              desc: 'Run-length encoded state diffs reduce packet payloads by over 98% across edge relays.',
              icon: <Layers className="w-5 h-5 text-violet-600" />,
            },
            {
              title: 'End-to-End Encryption',
              desc: 'AES-GCM encryption ensures edge relays route binary envelopes without reading plaintext.',
              icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
            },
            {
              title: 'Live Multiplayer Cursors',
              desc: 'Sub-millisecond presence channels for multi-cursors, selection ranges, and avatars.',
              icon: <Users className="w-5 h-5 text-amber-600" />,
            },
            {
              title: 'IndexedDB & SQLite Sync',
              desc: 'Instant cold-boot times by persisting state locally with transactional rollback support.',
              icon: <Database className="w-5 h-5 text-blue-600" />,
            },
            {
              title: 'Selective Undo / Redo',
              desc: 'Causal attribution preserves collaborator edits when reverting your own individual actions.',
              icon: <RotateCcw className="w-5 h-5 text-rose-600" />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-xs hover:border-slate-300 hover:shadow-sm transition"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SDK Section */}
      <section id="code" className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Simple 5-Line Integration
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Idiomatic hooks and bindings for React, TypeScript, and Vue.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 shadow-xl overflow-hidden">
          <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveCodeTab('react')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeCodeTab === 'react' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                React Hook
              </button>
              <button
                onClick={() => setActiveCodeTab('ts')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeCodeTab === 'ts' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                TypeScript / Node
              </button>
              <button
                onClick={() => setActiveCodeTab('vue')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeCodeTab === 'vue' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Vue 3
              </button>
            </div>

            <button
              onClick={() => copyToClipboard('// Snippet copied', true)}
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 transition flex items-center gap-1.5"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-slate-300">
            {activeCodeTab === 'react' && (
              <pre>
                <code>{`import { useCRDTDoc, useMultiplayerPresence } from '@converge/react';

export function CollaborativeDoc({ docId }) {
  // 1. Bind state to decentralized CRDT sequence
  const [doc, updateDoc] = useCRDTDoc(docId, {
    relay: 'wss://relay.converge.dev/room',
    persistence: 'indexeddb'
  });

  // 2. Broadcast live presence cursors
  const { peers, broadcastCursor } = useMultiplayerPresence(docId);

  return (
    <div onPointerMove={(e) => broadcastCursor({ x: e.clientX, y: e.clientY })}>
      <textarea value={doc.text} onChange={(e) => updateDoc(e.target.value)} />
      {peers.map(peer => <RemoteCursor key={peer.id} peer={peer} />)}
    </div>
  );
}`}</code>
              </pre>
            )}

            {activeCodeTab === 'ts' && (
              <pre>
                <code>{`import { ConvergeEngine, RelayProvider } from '@converge/crdt';

const engine = new ConvergeEngine({ siteId: 'worker-1' });
const doc = engine.getOrCreateDocument('project-room');

// Connect to Edge WebSocket relay
const relay = new RelayProvider('wss://relay.converge.dev', doc);

// 0ms local mutation
doc.insertText(0, 'Collaborate freely without merge conflicts.');`}</code>
              </pre>
            )}

            {activeCodeTab === 'vue' && (
              <pre>
                <code>{`<script setup>
import { useCRDTComposable } from '@converge/vue';

const { state, insert, peers } = useCRDTComposable('room-123', {
  relay: 'wss://relay.converge.dev',
});
</script>`}</code>
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* Benchmarks & Pricing */}
      <section id="benchmarks" className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { value: '< 0.8ms', label: 'Local Latency' },
            { value: '150k+', label: 'Ops / Sec Core' },
            { value: '98%', label: 'Delta Compression' },
            { value: '0%', label: 'Conflict Loss' },
          ].map((m, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200/70 text-center shadow-xs">
              <div className="text-2xl font-black font-mono text-slate-900 mb-0.5">{m.value}</div>
              <div className="text-[11px] font-semibold text-slate-500">{m.label}</div>
            </div>
          ))}
        </div>

        <div id="pricing" className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/70 flex flex-col justify-between shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Community Engine</h3>
              <p className="text-xs text-slate-500 mb-4">Open-source CRDT engine for indie apps.</p>
              <div className="text-3xl font-black font-mono text-slate-900 mb-6">$0</div>
              <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 100% Open Source</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Unlimited local documents</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> WebRTC P2P provider</li>
              </ul>
            </div>
            <a href="#code" className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-center text-xs font-bold text-slate-800 transition">
              Get Library
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white border-2 border-slate-900 relative flex flex-col justify-between shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
              Popular
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Edge Cloud Relay</h3>
              <p className="text-xs text-slate-500 mb-4">Global low-latency managed sync relays.</p>
              <div className="text-3xl font-black font-mono text-slate-900 mb-6">$29 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
              <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-600" /> 35+ Edge Relay Regions (&lt;20ms)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-600" /> 100,000 Monthly Active Users</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-600" /> Encrypted Cloud Backup</li>
              </ul>
            </div>
            <a href="#" className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-center text-xs font-bold text-white transition">
              Start Free Trial
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/70 flex flex-col justify-between shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Enterprise</h3>
              <p className="text-xs text-slate-500 mb-4">Dedicated VPCs and 99.999% SLA.</p>
              <div className="text-3xl font-black font-mono text-slate-900 mb-6">Custom</div>
              <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Dedicated Kubernetes clusters</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> SOC2 & HIPAA compliance</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 24/7 Slack support</li>
              </ul>
            </div>
            <a href="#" className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-center text-xs font-bold text-slate-800 transition">
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white py-12 px-5 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              <FileText className="w-3 h-3" />
            </div>
            <span className="font-bold text-slate-900">ConvergeCRDT</span>
            <span>&bull;</span>
            <span>Open Source Apache-2.0 / MIT</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>38 / 38 Relays Operational</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
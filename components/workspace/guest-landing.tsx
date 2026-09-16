'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  Zap,
  ShieldCheck,
  Users,
  Layers,
  MousePointer2,
} from 'lucide-react';
import { WORKSPACE_TEMPLATES } from './template-gallery';

interface GuestLandingProps {
  onOpenAuth: () => void;
  onDemoLogin: () => Promise<void>;
  isDemoLoading: boolean;
}

export function GuestLanding({
  onOpenAuth,
  onDemoLogin,
  isDemoLoading,
}: GuestLandingProps) {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/70 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6 shadow-xs">
            <Sparkles className="size-3.5 text-indigo-500" />
            <span>Converge Engine 2.0 &bull; Local-First Collaborative Canvas</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Where ideas converge{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              in real time.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The next-generation collaborative document workspace. Built with mathematically verified CRDTs, sub-10ms peer sync, and rich block formatting.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <Button
              size="lg"
              onClick={onOpenAuth}
              className="w-full sm:w-auto h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/20 text-sm gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="size-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              disabled={isDemoLoading}
              onClick={onDemoLogin}
              className="w-full sm:w-auto h-11 px-5 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium rounded-xl text-sm gap-2"
            >
              <Sparkles className="size-4 text-indigo-500" />
              <span>{isDemoLoading ? 'Entering Workspace...' : '1-Click Demo Review'}</span>
            </Button>
          </div>

          {/* Interactive Live Document Teaser */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden text-left">
            {/* Window bar */}
            <div className="h-10 px-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-rose-400" />
                <div className="size-3 rounded-full bg-amber-400" />
                <div className="size-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Layers className="size-3 text-indigo-500" />
                  Engineering Spec — Distributed CRDT Engine.doc
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
            </div>

            {/* Document Canvas Teaser */}
            <div className="p-6 sm:p-8 space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                RFC #412: Zero-Conflict Realtime Convergence
              </h3>

              <div className="relative p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed relative">
                  Converge uses state-based replication over WebSockets. Concurrent edits across peers are modeled as commutative operations, ensuring identical document trees regardless of packet arrival order.
                  {/* Simulated Remote Cursor 1 */}
                  <span className="inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-indigo-500 text-[10px] font-bold text-white shadow-xs animate-bounce">
                    <MousePointer2 className="size-2.5 fill-current" />
                    Tarun (Lead)
                  </span>
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative">
                  In memory, the Yjs document state maintains an append-only sequence of character operations with Lamport timestamps.
                  {/* Simulated Remote Cursor 2 */}
                  <span className="inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-purple-500 text-[10px] font-bold text-white shadow-xs">
                    <MousePointer2 className="size-2.5 fill-current" />
                    Alex (Design)
                  </span>
                </p>
              </div>

              {/* Status bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <span>Peers connected: <strong>2 active</strong></span>
                  <span>Latency: <strong>4ms</strong></span>
                  <span>Engine: <strong>Hocuspocus + Neon</strong></span>
                </div>
                <div>
                  <span>Last reconciled: <strong>just now</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Grid */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Architecture Built For Scale
            </h2>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              Everything required for seamless engineering collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
              <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Zap className="size-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sub-10ms Synchronization
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Bi-directional WebSockets powered by Hocuspocus propagate typing updates and remote presence across teammates in single-digit milliseconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
              <div className="size-10 rounded-xl bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-900 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Zero Merge Conflicts
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Yjs conflict-free replicated data types eliminate race conditions. Whether offline on an airplane or simultaneously typing the same line, convergence is guaranteed.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
              <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Users className="size-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Production Auth & Storage
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Strict 3-layer architecture backed by Neon PostgreSQL, Prisma ORM, and JWT authentication. Ownership and collaborator permissions enforced on every route.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Templates Showcase */}
      <section className="py-14 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Curated Document Templates
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            Jumpstart specs, meeting notes, and architecture docs right out of the box.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {WORKSPACE_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                onClick={onOpenAuth}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left cursor-pointer hover:border-indigo-400 transition"
              >
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {tpl.category}
                </span>
                <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1 truncate">
                  {tpl.name}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                  {tpl.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

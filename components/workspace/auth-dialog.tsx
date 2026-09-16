'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, name?: string) => Promise<void>;
  onDemoLogin: () => Promise<void>;
}

export function AuthDialog({
  open,
  onOpenChange,
  onLogin,
  onRegister,
  onDemoLogin,
}: AuthDialogProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setErrorMessage(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (tab === 'login') {
        await onLogin(email, password);
      } else {
        await onRegister(email, password, name);
      }
      handleOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = async () => {
    setErrorMessage(null);
    setIsDemoSubmitting(true);
    try {
      await onDemoLogin();
      handleOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Demo login failed';
      setErrorMessage(msg);
    } finally {
      setIsDemoSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {tab === 'login' ? 'Sign in to Converge' : 'Create your account'}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            {tab === 'login'
              ? 'Access your collaborative documents and real-time workspaces.'
              : 'Start collaborating instantly with sub-10ms CRDT sync.'}
          </DialogDescription>
        </DialogHeader>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 mt-3">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tab === 'register'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs mt-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
          {tab === 'register' && (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isDemoSubmitting}
            className="w-full h-9 mt-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : tab === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 text-[11px] font-medium">
              or test instantly
            </span>
          </div>
        </div>

        {/* 1-Click Demo Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleDemoClick}
          disabled={isSubmitting || isDemoSubmitting}
          className="w-full h-9 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg gap-2"
        >
          {isDemoSubmitting ? (
            <Loader2 className="size-4 animate-spin text-indigo-600" />
          ) : (
            <>
              <Sparkles className="size-3.5 text-indigo-500" />
              <span>Continue as Tarun (1-Click Demo)</span>
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';

import { modeKey } from '@/lib/api/queryKeys';
import { useCursorList } from '@/lib/hooks/useCursorList';
import { useMode } from '@/lib/mode/useMode';

import { getBalance, listLedgerEntries } from '../api/balanceApi';

export function useBalance() {
  const { mode } = useMode();
  return useQuery({ queryKey: modeKey('balance', mode), queryFn: () => getBalance(mode) });
}

export function useLedgerEntries() {
  const { mode } = useMode();
  return useCursorList(modeKey('ledger', mode), (cursor) => listLedgerEntries(mode, cursor));
}

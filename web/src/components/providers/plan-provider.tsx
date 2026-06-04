'use client';

import { createContext, useContext } from 'react';
import type { PlanId } from '@/config/plans';

interface PlanContextValue {
  planId: PlanId;
  isCloud: boolean;
}

const PlanContext = createContext<PlanContextValue>({
  planId: 'self_hosted',
  isCloud: false,
});

export function PlanProvider({ planId, children }: { planId: PlanId; children: React.ReactNode }) {
  const isCloud = process.env.NEXT_PUBLIC_IS_CLOUD === 'true';
  const effectivePlan: PlanId = isCloud ? planId : 'self_hosted';

  return (
    <PlanContext.Provider value={{ planId: effectivePlan, isCloud }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlanContext() {
  return useContext(PlanContext);
}

import { ActivityAllocation, ResourceCost } from './types.js';

export interface AbcResult {
  period: string;
  totalResources: number;
  activities: Array<{
    activity: string;
    allocatedCost: number;
    objects: Array<{ objectType: string; objectId: string; cost: number }>;
  }>;
}

export function calculateAbc(period: string, resources: ResourceCost[], allocations: ActivityAllocation[]): AbcResult {
  const res = resources.filter((r) => r.period === period);
  const acts = allocations.filter((a) => a.period === period);

  const totalResources = res.reduce((sum, item) => sum + item.amount, 0);
  const totalActivityDriver = acts.reduce((sum, item) => sum + item.activityDriverValue, 0) || 1;

  const activityMap = new Map<string, ActivityAllocation[]>();
  acts.forEach((a) => {
    const existing = activityMap.get(a.activity) ?? [];
    existing.push(a);
    activityMap.set(a.activity, existing);
  });

  return {
    period,
    totalResources,
    activities: Array.from(activityMap.entries()).map(([activity, items]) => {
      const activityDriver = items.reduce((sum, item) => sum + item.activityDriverValue, 0);
      const allocatedCost = totalResources * (activityDriver / totalActivityDriver);
      return {
        activity,
        allocatedCost,
        objects: items.map((obj) => ({
          objectType: obj.objectType,
          objectId: obj.objectId,
          cost: allocatedCost * (obj.activityDriverValue / activityDriver)
        }))
      };
    })
  };
}

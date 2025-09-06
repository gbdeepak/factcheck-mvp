import { Fact, FactGroup, FactData, DashboardStats } from '@/types';

export function processFactData(data: FactData): {
  factGroups: FactGroup[];
  stats: DashboardStats;
} {
  const factGroups: FactGroup[] = [];
  let totalFacts = 0;
  let inconsistentFacts = 0;
  let consistentFacts = 0;

  Object.entries(data).forEach(([key, facts]) => {
    totalFacts += facts.length;
    
    const isInconsistent = facts.length > 1;
    if (isInconsistent) {
      inconsistentFacts += facts.length;
    } else {
      consistentFacts += facts.length;
    }

    factGroups.push({
      key,
      facts,
      isInconsistent,
      factName: facts[0]?.fact_name || key
    });
  });

  const consistencyRate = totalFacts > 0 ? (consistentFacts / totalFacts) * 100 : 0;

  const stats: DashboardStats = {
    totalFacts,
    inconsistentFacts,
    consistentFacts,
    consistencyRate: Math.round(consistencyRate * 10) / 10
  };

  return { factGroups, stats };
}

export function filterFactGroups(factGroups: FactGroup[], filter: 'all' | 'inconsistent' | 'consistent'): FactGroup[] {
  switch (filter) {
    case 'inconsistent':
      return factGroups.filter(group => group.isInconsistent);
    case 'consistent':
      return factGroups.filter(group => !group.isInconsistent);
    default:
      return factGroups;
  }
}

export function searchFactGroups(factGroups: FactGroup[], searchTerm: string): FactGroup[] {
  if (!searchTerm.trim()) return factGroups;
  
  const term = searchTerm.toLowerCase();
  return factGroups.filter(group => 
    group.factName.toLowerCase().includes(term) ||
    group.facts.some(fact => 
      fact.value.toLowerCase().includes(term) ||
      fact.document_title.toLowerCase().includes(term) ||
      fact.context.toLowerCase().includes(term)
    )
  );
}

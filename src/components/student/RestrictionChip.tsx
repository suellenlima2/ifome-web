import { Leaf, Flame, Wheat, Droplets } from 'lucide-react';
import { Tag } from '@/components/ui/Tag';
import type { RestrictionKey } from '@/types';

const RESTRICTIONS: Record<RestrictionKey, { label: string; tone: 'green' | 'yellow' | 'purple' | 'red'; icon: typeof Leaf }> = {
  vegetarian:  { label: 'Vegetariano', tone: 'green',  icon: Leaf     },
  vegan:       { label: 'Vegano',      tone: 'green',  icon: Leaf     },
  glutenFree:  { label: 'Sem glúten',  tone: 'yellow', icon: Wheat    },
  lactoseFree: { label: 'Sem lactose', tone: 'purple', icon: Droplets },
  spicy:       { label: 'Picante',     tone: 'red',    icon: Flame    },
};

export function RestrictionChip({ k }: { k: string }) {
  const r = RESTRICTIONS[k as RestrictionKey];
  if (!r) return null;
  return <Tag tone={r.tone} icon={r.icon}>{r.label}</Tag>;
}

export { RESTRICTIONS };

import { EntityType } from '@/lib/types';

const badgeColors: Record<EntityType, string> = {
  [EntityType.CHARACTER]: 'bg-blue-500',
  [EntityType.PLACE]: 'bg-green-500',
  [EntityType.ARTIFACT]: 'bg-purple-500',
  [EntityType.EVENT]: 'bg-orange-500',
  [EntityType.GROUP]: 'bg-pink-500',
};

export function EntityBadge({ type }: { type: EntityType }) {
  return (
    <span
      className={`${badgeColors[type]} text-white text-xs px-2 py-1 rounded-full font-semibold`}
    >
      {type}
    </span>
  );
}


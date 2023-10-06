import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CollectionWithPinnedStatus } from '../bindings';
import { useEffect, useState } from 'react';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CollectionPinned = Omit<CollectionWithPinnedStatus, 'pinnedBy'> & {
  isPinned: boolean;
};

export function MakeCollectionWithPinnedStatus(
  collection: CollectionWithPinnedStatus,
): CollectionPinned {
  const { pinnedBy, ...c } = collection;
  return {
    ...c,
    isPinned: pinnedBy.length > 0 ? true : false,
  } as CollectionPinned;
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

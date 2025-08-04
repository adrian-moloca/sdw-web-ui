import { NavigationItem } from '@toolpad/core';

export function hasKids(item: NavigationItem): item is NavigationItem & {
  segment: string;
  title: string;
  icon?: React.ReactNode;
  children: NavigationItem[];
} {
  const anyItem = item as any;
  return (
    typeof anyItem.segment === 'string' &&
    Array.isArray(anyItem.children) &&
    anyItem.children.length > 0
  );
}

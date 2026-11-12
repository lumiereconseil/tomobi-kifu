export type QueuedPost = { text: string; lang?: string; from?: string; until?: string };
export type Facet = { index: { byteStart: number; byteEnd: number }; features: Record<string, string>[] };
export const MAX_GRAPHEMES: number;
export function jstDate(now?: Date): string;
export function activePosts<T extends QueuedPost>(posts: T[], day: string): T[];
export function pickPost<T extends QueuedPost>(posts: T[], day: string): T | undefined;
export function graphemeCount(text: string): number;
export function facets(text: string): Facet[];

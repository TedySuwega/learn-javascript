import { SortOrder } from "../types/user";

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;

export interface PageOptions {
  page: number;
  limit: number;
}

/** Clamp `page` and `limit` to safe values. */
export function parsePagination(
  pageRaw?: string,
  limitRaw?: string,
): PageOptions {
  const page = Math.max(1, parseInt(pageRaw ?? "1", 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(limitRaw ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT),
  );
  return { page, limit };
}

export function parseSortOrder(value?: string): SortOrder {
  return value === "asc" ? "asc" : "desc";
}

/** Returns the sort field if it's whitelisted, otherwise undefined. */
export function parseSortField<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T | undefined {
  if (!value) return undefined;
  return (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined;
}

export function parseBoolean(value?: string): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

/** Parse a numeric path param; returns null when invalid. */
export function parseId(raw: string): number | null {
  const n = parseInt(raw, 10);
  return Number.isNaN(n) || n <= 0 ? null : n;
}

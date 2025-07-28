export interface PaginatedEntityWithCursor<T, K> {
  entities: T[];
  next: K | null;
  prev: K | null;
}

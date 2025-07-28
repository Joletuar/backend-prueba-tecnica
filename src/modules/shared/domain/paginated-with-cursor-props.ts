export interface PaginatedWithCursorProps<T = any> {
  next?: T | null;
  prev?: T | null;
  limit?: number;
}

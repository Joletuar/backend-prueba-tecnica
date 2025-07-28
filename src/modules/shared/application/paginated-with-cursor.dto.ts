export interface PaginatedDtoWithCursor<T> {
  dtos: T[];
  next: string | null;
  prev: string | null;
}

export interface PaginatedList<T> {
    rows: T[];
    page: number;
    pageSize: number;
    query: string;
    totalRecords: number;
}

export interface PaginatedListRequest {
    page: number;
    pageSize: number;
    query?: string;
}

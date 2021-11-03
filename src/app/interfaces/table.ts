import { PageEvent } from "@angular/material/paginator";

export interface TableEvent<T> {
  row: T;
  index: number;
}

export const pageOptions: PageEvent = {
  length: 0,
  pageIndex: 0,
  pageSize: 20,
};

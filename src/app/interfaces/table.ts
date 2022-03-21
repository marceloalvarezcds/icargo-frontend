import { MatCheckboxChange } from '@angular/material/checkbox';
import { PageEvent } from '@angular/material/paginator';

export interface TableEvent<T> {
  row: T;
  index: number;
}

export interface CheckboxEvent<T> {
  event: MatCheckboxChange;
  value: TableEvent<T>;
}

export const pageOptions: PageEvent = {
  length: 0,
  pageIndex: 0,
  pageSize: 20,
};

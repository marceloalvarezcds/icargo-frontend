import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Column } from 'src/app/interfaces/column';
import { SelectorDialogData } from 'src/app/interfaces/dialog-data';
import { TableSelectorComponent } from 'src/app/shared/table-selector/table-selector.component';

@Component({
  selector: 'app-selector-dialog',
  templateUrl: './selector-dialog.component.html',
  styleUrls: ['./selector-dialog.component.scss']
})
export class SelectorDialogComponent<T> {

  selectValue?: T | null;
  searchControl = new FormControl('');

  get searchValue(): string {
    return this.searchControl.value;
  }

  get title(): string {
    return this.data.title;
  }

  get columns(): Column[] {
    return this.data.columns;
  }

  get list(): T[] {
    return this.data.list;
  }

  get fetchFunction(): any {
    return this.data.fetchFunction;
  }

  get isFetchPaginator(): boolean {
    return this.data.isFetchPaginator;
  }

  @ViewChild('app-table-selector') dialogField?: TableSelectorComponent<T>;

  constructor(
    public dialogRef: MatDialogRef<SelectorDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) private data: SelectorDialogData<T>,
  ) {
    this.selectValue = data.selectedValue;
  }

  select() {
    this.dialogRef.close(this.selectValue);
  }
}

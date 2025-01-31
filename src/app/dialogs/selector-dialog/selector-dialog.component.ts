import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PermisoAccionEnum } from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { SelectorDialogData } from 'src/app/interfaces/dialog-data';
import { TableSelectorComponent } from 'src/app/shared/table-selector/table-selector.component';

@Component({
  selector: 'app-selector-dialog',
  templateUrl: './selector-dialog.component.html',
  styleUrls: ['./selector-dialog.component.scss'],
})
export class SelectorDialogComponent<T> {
  selectValue?: T | null;
  searchControl = new FormControl('');
  a = PermisoAccionEnum;

  get subtitle(): string | undefined {
    return this.data.subtitle;
  }

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
    return !!this.data.fetchFunction;
  }

  get fetchFunctionLoal(): any {
    return this.data.fetchFunctionLocal;
  }

  get showBotonCrear():boolean {
    return this.data.dialogRefFunctionCrear ? true : false;
  }

  @ViewChild('app-table-selector') dialogField?: TableSelectorComponent<T>;

  constructor(
    public dialogRef: MatDialogRef<SelectorDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) private data: SelectorDialogData<T>
  ) {
    this.selectValue = data.selectedValue;
  }

  select() {
    this.dialogRef.close(this.selectValue);
  }

  openCreateDialog():void {

    const dialogCrearRef = this.data.dialogRefFunctionCrear ? this.data.dialogRefFunctionCrear() : null;

    if (dialogCrearRef) {

      this.dialogRef.close(null);

      dialogCrearRef
        .afterClosed()
        .subscribe((resp1: T) => {

          if (resp1) {

            this.fetchFunctionLoal().subscribe((resp2:any) => {

              this.data.list = resp2;
              this.data.nuevoEleEvent!.next([resp1, resp2]);
              this.data.nuevoEleEvent!.complete();

            })

          } else {
            this.data.backEleEventsSubject!.next(this.list);
            this.data.backEleEventsSubject!.complete();
          }

        });
    }

  }

}

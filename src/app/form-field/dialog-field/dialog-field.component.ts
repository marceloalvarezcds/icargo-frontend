import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SelectorDialogComponent } from 'src/app/dialogs/selector-dialog/selector-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { SelectorDialogData } from 'src/app/interfaces/dialog-data';
import { getIdFromAny } from 'src/app/utils/form-control';

@Component({
  selector: 'app-dialog-field',
  templateUrl: './dialog-field.component.html',
  styleUrls: ['./dialog-field.component.scss'],
  exportAs: 'app-dialog-field',
})
export class DialogFieldComponent<T extends { id: number }>
  implements OnDestroy
{
  formGroup?: FormGroup;
  lista: T[] = [];
  selectedValue?: T;
  subscription?: Subscription;
  statusSubscription?: Subscription;

  get group(): FormGroup {
    if (this.groupName) {
      return this.formGroup?.get(this.groupName) as FormGroup;
    }
    return this.formGroup!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  get disabled(): boolean {
    return this.control.disabled;
  }

  get list(): T[] {
    return this.lista;
  }

  get rowValue(): T | string | number | undefined {
    const obj = this.group.getRawValue();
    return obj[this.controlName];
  }

  @Input() set form(f: FormGroup) {
    if (f) {
      this.formGroup = f;
      const currentId = getIdFromAny(this.rowValue);
      this.setValueChange(currentId);
      const selectedId = this.selectedValue?.id;
      this.subscription = this.control.valueChanges
        .pipe(map((v) => getIdFromAny(v)))
        .pipe(filter((v) => v !== selectedId))
        .subscribe(this.setValueChange.bind(this));
    }
  }
  @Input() columns: Column[] = [];
  @Input() controlName!: string;
  @Input() groupName?: string;
  @Input() inputValueFormat: (v: T | undefined) => string = () => '';
  @Input() set list(list: T[]) {
    this.lista = list;
    if (this.formGroup) {
      const currentId = getIdFromAny(this.rowValue);
      this.setValueChange(currentId);
    }
  }
  @Input() title = '';

  @Output() valueChange = new EventEmitter<T>();

  constructor(private dialog: MatDialog) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.statusSubscription?.unsubscribe();
  }

  clearSelectedValue(event: MouseEvent): void {
    this.setSelectedValue(undefined);
    event.stopPropagation();
  }

  openDialog(): void {
    const data: SelectorDialogData<T> = {
      list: this.list.slice(),
      columns: this.columns.slice(),
      title: this.title,
      selectedValue: this.selectedValue,
    };
    const config: MatDialogConfig = {
      data,
      panelClass: 'selector-dialog',
      position: {
        top: '1rem',
      },
    };
    this.dialog
      .open(SelectorDialogComponent, config)
      .afterClosed()
      .pipe(filter((contacto) => !!contacto))
      .subscribe((selectedValue: T) => {
        this.setSelectedValue(selectedValue);
      });
  }

  private setValueChange(id: string | number | undefined): void {
    this.selectedValue = this.list.find((x) => x.id === id);
    this.valueChange.emit(this.selectedValue);
  }

  private setSelectedValue(selectedValue: T | undefined): void {
    this.selectedValue = selectedValue;
    this.control.setValue(selectedValue?.id ?? null);
    this.valueChange.emit(selectedValue);
  }
}

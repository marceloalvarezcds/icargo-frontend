import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SelectorDialogComponent } from 'src/app/dialogs/selector-dialog/selector-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { SelectorDialogData } from 'src/app/interfaces/dialog-data';

@Component({
  selector: 'app-dialog-field',
  templateUrl: './dialog-field.component.html',
  styleUrls: ['./dialog-field.component.scss'],
  exportAs: 'app-dialog-field'
})
export class DialogFieldComponent<T extends { id: number }> implements OnDestroy {

  formGroup?: FormGroup;
  selectedValue?: T;
  subscription?: Subscription;

  get group(): FormGroup {
    if (this.groupName) {
      return this.formGroup!.get(this.groupName) as FormGroup;
    }
    return this.formGroup!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  get disabled(): boolean {
    return this.control.disabled;
  }

  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    const selectedId = this.selectedValue?.id;
    this.subscription = this.control.valueChanges
      .pipe(map(v => (typeof v === 'string' || typeof v === 'number') ? Number(v) : Number(v.id)))
      .pipe(filter(v => !!v && v !== selectedId))
      .subscribe(id => {
        this.selectedValue = this.list.find(x => x.id === id);
        this.valueChange.emit(this.selectedValue);
      });
  }
  @Input() columns: Column[] = [];
  @Input() controlName!: string;
  @Input() groupName?: string;
  @Input() inputValueFormat: (v: T | undefined) => string = () => '';
  @Input() list: T[] = [];
  @Input() title = '';

  @Output() valueChange = new EventEmitter<T>();

  constructor(private dialog: MatDialog) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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
    }
    const config: MatDialogConfig = {
      data,
      panelClass: 'selector-dialog',
      position: {
        top: '1rem',
      },
    }
    this.dialog
      .open(SelectorDialogComponent, config)
      .afterClosed()
      .pipe(filter((contacto) => !!contacto))
      .subscribe((selectedValue: T) => {
        this.setSelectedValue(selectedValue);
      });
  }

  private setSelectedValue(selectedValue: T | undefined): void {
    this.selectedValue = selectedValue;
    this.control.setValue(selectedValue?.id ?? null);
    this.valueChange.emit(selectedValue);
  }
}

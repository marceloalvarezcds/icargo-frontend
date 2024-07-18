import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SelectorDialogComponent } from 'src/app/dialogs/selector-dialog/selector-dialog.component';
import { Column } from 'src/app/interfaces/column';
import {
  PaginatedList,
  PaginatedListRequest,
} from 'src/app/interfaces/paginate-list';
import { DialogFormFieldControlComponent } from '../dialog-form-field-control/dialog-form-field-control.component';

@Component({
  selector: 'app-dialog-field-oc',
  templateUrl: './dialog-field-oc.component.html',
  styleUrls: ['./dialog-field-oc.component.scss']
})
export class DialogFieldOcComponent<
T extends { id: number },
DialogComponent = SelectorDialogComponent<T>
> {
get group(): FormGroup {
  if (this.groupName) {
    return this.form?.get(this.groupName) as FormGroup;
  }
  return this.form!;
}

get control(): FormControl {
  return this.group.get(this.controlName) as FormControl;
}

get disabled(): boolean {
  return this.control.disabled;
}

@Input() form?: FormGroup;
@Input() columns: Column[] = [];
@Input() controlName!: string;
@Input() groupName?: string;
@Input() hint = '';
@Input() emptyHint = 'No existen elementos. Debe de crearlo/activarlo.';
@Input() inputValuePropName!: string;
@Input() list: T[] = [];
@Input() title = '';
@Input() subtitle = '';
@Input() dialogRefFunction?: (
  selectedValue: T | undefined
) => MatDialogRef<DialogComponent>;
@Input() fetchFunction?: (
  request: PaginatedListRequest
) => Observable<PaginatedList<T>>;
@Input() set readonly(val: boolean) {
  val ? this.control.disable() : this.control.enable();
}

@Output() clearClick = new EventEmitter();
@Output() emptyListChange = new EventEmitter();
@Output() valueChange = new EventEmitter<T>();

@ViewChild(DialogFormFieldControlComponent)
dialogFieldControl?: DialogFormFieldControlComponent<T>;

constructor() {}

clearSelectedValue(): void {
  this.dialogFieldControl?.clearSelectedValue();
  this.clearClick.emit();
}

openDialog(): void {
  this.dialogFieldControl?.openDialog();
}
}



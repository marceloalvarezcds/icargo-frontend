import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Column } from 'src/app/interfaces/column';
import { PaginatedList, PaginatedListRequest } from 'src/app/interfaces/paginate-list';
import { DialogFormFieldControlComponent } from '../dialog-form-field-control/dialog-form-field-control.component';

@Component({
  selector: 'app-dialog-field',
  templateUrl: './dialog-field.component.html',
  styleUrls: ['./dialog-field.component.scss'],
  exportAs: 'app-dialog-field',
})
export class DialogFieldComponent<T extends { id: number }> {
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
  @Input() inputValuePropName!: string;
  @Input() list: T[] = [];
  @Input() title = '';
  @Input() fetchFunction?: (request: PaginatedListRequest) => Observable<PaginatedList<T>>;

  @Output() valueChange = new EventEmitter<T>();

  @ViewChild(DialogFormFieldControlComponent)
  dialogFieldControl?: DialogFormFieldControlComponent<T>;

  constructor() {}

  clearSelectedValue(): void {
    this.dialogFieldControl?.clearSelectedValue();
  }

  openDialog(): void {
    this.dialogFieldControl?.openDialog();
  }
}

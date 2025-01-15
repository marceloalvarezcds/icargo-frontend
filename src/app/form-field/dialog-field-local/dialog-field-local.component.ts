import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SelectorDialogComponent } from 'src/app/dialogs/selector-dialog/selector-dialog.component';
import { Column } from 'src/app/interfaces/column';
import {
  PaginatedList,
  PaginatedListRequest,
} from 'src/app/interfaces/paginate-list';
import { DialogFormFieldControlLocalComponent } from '../dialog-form-field-control-local/dialog-form-field-control-local.component';

@Component({
  selector: 'app-dialog-field-local',
  templateUrl: './dialog-field-local.component.html',
  styleUrls: ['./dialog-field-local.component.scss']
})
export class DialogFieldLocalComponent <T extends { id: number }, DialogComponent = SelectorDialogComponent<T>>
implements AfterViewInit
{

  private isreadonly = false;
  isOpen = false;
  idSubscription:any;

  @Input() item?:T;
  @Input() form?: FormGroup;
  @Input() formControl?: AbstractControl | null;
  @Input() columns: Column[] = [];
  @Input() controlName!: string;
  @Input() groupName?: string;
  @Input() hint = '';
  @Input() emptyHint = 'No existen elementos. Debe de crearlo/activarlo.';
  @Input() inputValuePropName!: string;
  @Input() list: T[] = [];
  @Input() title = '';
  @Input() subtitle = '';
  //@Input() dialogRefFunction?: (selectedValue: T | undefined) => MatDialogRef<DialogComponent>;
  @Input() dialogRefFunction?: (selectedValue: T | undefined) => MatDialogRef<DialogComponent>;
  @Input() fetchFunction?: (request: PaginatedListRequest) => Observable<PaginatedList<T>>;
  @Input() fetchFunctionLocal?: () => Observable<T[]>;
  @Input()
  get readonly(): boolean {
    return this.isreadonly;
  }
  set readonly(val: boolean) {
    this.isreadonly = val;
    //val ? this.control.disable() : this.control.enable();
  }

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

  @Input() isRemote = false;
  @Input() itemEvents?: Observable<any>;
  @Output() clearClick = new EventEmitter();
  @Output() emptyListChange = new EventEmitter();
  @Output() valueChange = new EventEmitter<T>();

  @ViewChild(DialogFormFieldControlLocalComponent)
  dialogFieldControl?: DialogFormFieldControlLocalComponent<T>;

  constructor() {}

  ngAfterViewInit(): void {
    if (this.readonly) this.control.disable()
    else this.control.enable();
  }

  clearSelectedValue(): void {
    this.dialogFieldControl?.clearSelectedValue();
    this.clearClick.emit();
  }

  openDialog(): void {
    this.dialogFieldControl?.openDialog();
  }

  close() {
    this.isOpen = false;
  }

}

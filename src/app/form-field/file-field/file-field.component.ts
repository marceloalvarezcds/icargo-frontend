import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileChangeEvent } from 'src/app/interfaces/file-change-event';

@Component({
  selector: 'app-file-field',
  templateUrl: './file-field.component.html',
  styleUrls: ['./file-field.component.scss']
})
export class FileFieldComponent {

  fieldFile: File | null = null;

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get fieldControl(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() className = 'col-xs-12 col-sm-6';
  @Input() controlName = '';
  @Input() form?: FormGroup;
  @Input() file: File | null = null;
  @Input() field: string | null = null;
  @Input() groupName?: string;
  @Input() isShow = false;
  @Input() title = '';
  @Input() set isEdit(isEdit: boolean) {
    if (isEdit) {
      this.fieldControl.removeValidators(Validators.required);
    }
  }

  @Output() fileChange = new EventEmitter<File | null>();

  fieldChange(fieldEvent: FileChangeEvent): void {
    this.fieldFile = fieldEvent.target!.files!.item(0);
    this.fieldControl.setValue(this.fieldFile?.name);
    this.fileChange.emit(this.fieldFile);
  }
}

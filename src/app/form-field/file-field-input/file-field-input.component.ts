import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from 'src/app/dialogs/image-dialog/image-dialog.component';
import { FileChangeEvent } from 'src/app/interfaces/file-change-event';


@Component({
  selector: 'app-file-field-input',
  templateUrl: './file-field-input.component.html',
  styleUrls: ['./file-field-input.component.scss']
})
export class FileFieldInputComponent {
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

  @Input() className = '';
  @Input() controlName = '';
  @Input() form?: FormGroup;
  @Input() file: File | null = null;
  @Input() field: string | null = null;
  @Input() groupName?: string;
  @Input() isShow = false;
  @Input() title = '';
  @Input() requerido = false;
  @Input() set isEdit(isEdit: boolean) {
    if (isEdit) {
      this.fieldControl.removeValidators(Validators.required);
    }
  }

  @Output() fileChange = new EventEmitter<File | null>();

  constructor(
    private dialog: MatDialog,
  ) {}

  fieldChange(fieldEvent: FileChangeEvent): void {
    this.fieldFile = fieldEvent.target!.files!.item(0);
    this.fieldControl.setValue(this.fieldFile?.name);
    this.fileChange.emit(this.fieldFile);
  }

  openImageDialog():void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageBase64: this.fieldFile},
      width: 'auto',
      height: 'auto',
    });
  }

  openImageDialogEdit():void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl: this.field},
      width: 'auto',
      height: 'auto',
    });
  }

}



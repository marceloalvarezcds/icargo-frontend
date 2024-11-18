import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from 'src/app/dialogs/image-dialog/image-dialog.component';
import { FileChangeEvent } from 'src/app/interfaces/file-change-event';

@Component({
  selector: 'app-file-field',
  templateUrl: './file-field.component.html',
  styleUrls: ['./file-field.component.scss'],
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

  // get disabled(): boolean {
  //   return this.fieldControl.disabled
  // }

  @Input() autofocus = false;
  @Input() disabled = false;
  @Input() className = '';
  @Input() controlName = '';
  @Input() form?: FormGroup;
  @Input() file: File | null = null;
  @Input() field: string | null = null;
  @Input() groupName?: string;
  @Input() isShow = false;
  @Input() title = '';
  @Input() readonly = false;
  @Input() set isEdit(isEdit: boolean) {
    if (isEdit) {
      this.fieldControl.removeValidators(Validators.required);
    }
  }

  imageLoaded: boolean = false;

  constructor(
    private dialog: MatDialog,
  ) {}

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      // Handle file upload or processing logic here
      // For simplicity, let's assume the image is loaded after a short delay
      setTimeout(() => {
        this.imageLoaded = true; // Set imageLoaded to true once image is processed
      }, 1000); // Adjust this delay based on your actual processing time
    }
  }
  @Output() fileChange = new EventEmitter<File | null>();

  fieldChange(fieldEvent: Event): void {
    const inputElement = fieldEvent.target as HTMLInputElement;
    const file = inputElement.files?.item(0);
    if (file) {
      this.fieldFile = file;
      this.fieldControl.setValue(file.name);
      this.fileChange.emit(file);
      // Optional: Set imageLoaded to true if you want to track image loaded state separately
      // this.imageLoaded = true;
    }
  }

  openImageDialogEdit():void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl: this.field},
      width: 'auto',
      height: 'auto',
    });
  }

}

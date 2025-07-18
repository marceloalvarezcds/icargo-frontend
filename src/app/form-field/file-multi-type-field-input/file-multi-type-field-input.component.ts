import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from 'src/app/dialogs/image-dialog/image-dialog.component';
import { FileChangeEvent } from 'src/app/interfaces/file-change-event';

@Component({
  selector: 'app-file-multi-type-field-input',
  templateUrl: './file-multi-type-field-input.component.html',
  styleUrls: ['./file-multi-type-field-input.component.scss']
})
export class FileMultiTypeFieldInputComponent {
  fieldFiles: File[] = [];
  @Input() className = '';
  @Input() controlName = '';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() title = '';
  @Input() field: string | null = null; // URL si ya existe en BD
  @Input() isShow = false;
  @Input() isEdit = false;
  @Input() accept = '.pdf,.doc,.docx,.png, .jpg, .jpeg, .gif*';
  @Input() disabled = false;

  @Output() fileChange = new EventEmitter<File | null>();

  fileName: string | null = null;

  constructor(
    private dialog: MatDialog,
  ) {}

  get group(): FormGroup {
    return this.groupName ? (this.form!.get(this.groupName) as FormGroup) : this.form!;
  }

  get fieldControl(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  fieldChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.fileName = file?.name || null;
    this.fieldControl.setValue(file?.name || '');
    this.fileChange.emit(file);
  }

  getFileNameFromUrl(url: string): string {
    return url.split('/').pop() || 'archivo';
  }

  downloadExistingFile(): void {
    if (this.field) {
      window.open(this.field, '_blank');
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

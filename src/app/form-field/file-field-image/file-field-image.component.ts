import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-file-field-image',
  templateUrl: './file-field-image.component.html',
  styleUrls: ['./file-field-image.component.scss']
})
export class FileFieldImageComponent {
  fieldFile: File | null = null;
  fileURL: string = ''; // Agregado para almacenar la URL del archivo

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

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get fieldControl(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Output() fileChange = new EventEmitter<File | null>();

  fieldChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.item(0);
    if (file) {
      this.fieldFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fileURL = e.target.result; // Actualiza fileURL con la URL del archivo
        this.fieldControl.setValue(this.fileURL); // Muestra la URL en el input
      };
      reader.readAsDataURL(file);

      this.fileChange.emit(file); // Emite el archivo a través del EventEmitter
    } else {
      this.fileURL = ''; // Limpia la URL si no hay archivo
      this.fieldControl.setValue(''); // Limpia el valor del input si no hay archivo
    }
  }
}

import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { camionSemiNetoData } from 'src/app/form-data/camion-semi-neto';
import { CamionSemiNeto } from 'src/app/interfaces/camion-semi-neto';
import { CamionSemiNetoFormDialogData } from 'src/app/interfaces/camion-semi-neto-form-dialog-data';
import { CamionSemiNetoService } from 'src/app/services/camion-semi-neto.service';

@Component({
  selector: 'app-camion-semi-neto-form-dialog',
  templateUrl: './camion-semi-neto-form-dialog.component.html',
  styleUrls: ['./camion-semi-neto-form-dialog.component.scss'],
})
export class CamionSemiNetoFormDialogComponent {
  form = this.fb.group({
    camion_id: [this.camionId, Validators.required],
    semi_id: [this.data?.semi_id, Validators.required],
    producto_id: this.data?.producto_id,
    neto: [this.data?.neto, Validators.required],
  });

  get actionText(): string {
    return this.data ? 'Editar' : 'Crear';
  }

  get camionId(): number {
    return this.dialogData.camion_id;
  }

  get camionInfo(): string | undefined {
    return this.dialogData.camion_info;
  }

  get data(): CamionSemiNeto | undefined {
    return this.dialogData.item;
  }

  constructor(
    private camionSemiNetoService: CamionSemiNetoService,
    public dialogRef: MatDialogRef<CamionSemiNetoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: CamionSemiNetoFormDialogData
  ) {}

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = camionSemiNetoData(this.form);
      if (this.data && this.data?.id) {
        this.camionSemiNetoService
          .edit(this.data.id, formData)
          .subscribe(this.close.bind(this));
      } else {
        this.camionSemiNetoService
          .create(formData)
          .subscribe(this.close.bind(this));
      }
    }
  }

  private close(data: CamionSemiNeto): void {
    this.dialogRef.close(data);
  }
}

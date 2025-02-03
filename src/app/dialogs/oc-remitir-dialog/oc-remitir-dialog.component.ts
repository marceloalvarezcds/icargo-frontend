import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { OrdenCarga, OrdenCargaRemitir } from 'src/app/interfaces/orden-carga';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';

@Component({
  selector: 'app-oc-remitir-dialog',
  templateUrl: './oc-remitir-dialog.component.html',
  styleUrls: ['./oc-remitir-dialog.component.scss']
})
export class OcRemitirDialogComponent {

  form = this.fb.group({
    created_at: [this.data?.created_at ?? new Date().toJSON(), Validators.required],
  });
  

  constructor(
    private ordenCargaService: OrdenCargaService,
    public dialogRef: MatDialogRef<OcRemitirDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: OrdenCargaRemitir
  ) {}

  get data(): OrdenCarga | null {
    return this.dialogData.oc;
  }


  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
  
    if (this.form.valid) {
      const data = {
        ...this.form.value,
    
      };
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
  
      if (this.data?.id) {
        this.ordenCargaService
          .editRemitir(this.data?.id, formData)
          .subscribe(this.close.bind(this));
      }
    }
  }
  

  private close(data: OrdenCarga): void {
    this.dialogRef.close(data);
  }

}

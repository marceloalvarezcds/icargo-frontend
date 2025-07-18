import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComentariosFlota } from 'src/app/interfaces/comentarios-flota-dialog-data';
import { ComentarioFlotaService } from 'src/app/services/comentario-flota.service';

@Component({
  selector: 'app-comentarios-flota-form-dialog',
  templateUrl: './comentarios-flota-form-dialog.component.html',
  styleUrls: ['./comentarios-flota-form-dialog.component.scss']
})
export class ComentariosFlotaFormDialogComponent {

  form = this.fb.group({
    tipo_evento: [this.data?.tipo_evento, Validators.required],
    comentario: [this.data?.tipo_evento, Validators.required],
    archivo: null,
  });

  constructor(
  private fb: FormBuilder,
  private comentarioFlotaService: ComentarioFlotaService,
  public dialogRef: MatDialogRef<ComentariosFlotaFormDialogComponent>,
  @Inject(MAT_DIALOG_DATA) private data?: ComentariosFlota
  ) { }

  @Input() archivo: string | null = null;
  @Output() archivoChange = new EventEmitter<File | null>();

  submit(): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const formValue = this.form.value;

      const data = {
        ...formValue,
        comentable_type: this.data?.comentable_type,
        comentable_id: this.data?.comentable_id,
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));

      this.comentarioFlotaService.create(formData).subscribe(this.close.bind(this));
    }
  }

  private close(data: ComentariosFlota): void {
    this.dialogRef.close(data);
  }

}

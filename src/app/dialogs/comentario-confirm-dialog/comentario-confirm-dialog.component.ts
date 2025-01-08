import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComentarioConfirmDialogData } from 'src/app/interfaces/comentario-confirm-dialog-data';

@Component({
  selector: 'app-comentario-confirm-dialog',
  templateUrl: './comentario-confirm-dialog.component.html',
  styleUrls: ['./comentario-confirm-dialog.component.scss'],
})
export class ComentarioConfirmDialogComponent {
  comentario = new FormControl('');
  htmlContent = '';
  htmlFooter = '';
  constructor(
    public dialogRef: MatDialogRef<ComentarioConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ComentarioConfirmDialogData
  ) {
    if (data.comentarioRequirido) {
      this.comentario.setValidators(Validators.required);
      this.comentario.updateValueAndValidity();
    }
    if (data.htmlContent){
      this.htmlContent = data.htmlContent;
    }
    if (data.htmlFooter){
      this.htmlFooter = data.htmlFooter;
    }
  }
}

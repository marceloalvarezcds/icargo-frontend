import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-evaluaciones-dialog',
  templateUrl: './evaluaciones-dialog.component.html',
  styleUrls: ['./evaluaciones-dialog.component.scss']
})
export class EvaluacionesDialogComponent {

  constructor(public dialogRef: MatDialogRef<EvaluacionesDialogComponent>) {}

  // Método que se llama cuando el usuario cancela
  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  // Método que se llama cuando el usuario guarda
  onSaveClick(): void {
    this.dialogRef.close(true);
  }

}

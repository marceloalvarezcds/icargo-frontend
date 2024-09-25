import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-evaluaciones-dialog',
  templateUrl: './evaluaciones-dialog.component.html',
  styleUrls: ['./evaluaciones-dialog.component.scss']
})
export class EvaluacionesDialogComponent {

  fotoRegistroFile: File | null = null;
  localidadId?: number;
  paisId?: number;

  @Input() fotoRegistroFrente: string | null = null;
  @Input() fotoRegistroReverso: string | null = null;
  @Input() isEdit = false;
  @Input() isShow = false;

}

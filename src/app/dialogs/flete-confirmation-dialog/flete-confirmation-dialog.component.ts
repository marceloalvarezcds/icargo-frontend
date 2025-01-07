import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FleteConfirmationDialogData,
  FleteConfirmationInfo,
} from 'src/app/interfaces/flete-confirmation-dialog-data';

@Component({
  selector: 'app-flete-confirmation-dialog',
  templateUrl: './flete-confirmation-dialog.component.html',
  styleUrls: ['./flete-confirmation-dialog.component.scss'],
})
export class FleteConfirmationDialogComponent {
  Obj = Object;
  get flete(): FleteConfirmationInfo {
    return this.data.flete;
  }

  constructor(
    public dialogRef: MatDialogRef<FleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FleteConfirmationDialogData
  ) {}

}

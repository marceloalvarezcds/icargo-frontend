import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  OCConfirmationDialogData,
  OCConfirmationInfo,
} from 'src/app/interfaces/oc-confirmation-dialog-data';

@Component({
  selector: 'app-oc-confirmation-dialog',
  templateUrl: './oc-confirmation-dialog.component.html',
  styleUrls: ['./oc-confirmation-dialog.component.scss'],
})
export class OcConfirmationDialogComponent {
  Obj = Object;
  get oc(): OCConfirmationInfo | null {
    return this.data.oc;
  }

  constructor(
    public dialogRef: MatDialogRef<OcConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OCConfirmationDialogData
  ) {}
}

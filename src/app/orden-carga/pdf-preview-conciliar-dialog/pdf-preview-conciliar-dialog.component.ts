import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-pdf-preview-conciliar-dialog',
  templateUrl: './pdf-preview-conciliar-dialog.component.html',
  styleUrls: ['./pdf-preview-conciliar-dialog.component.scss']
})
export class PdfPreviewConciliarDialogComponent {
  pdfUrl: string;
  filename: string;
  fileBlob: Blob;
  isGeneratingPdf: boolean = false;
  title = 'Vista previa del PDF';
  buttonText = 'GUARDAR RESÚMEN | CANCELADO';


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.pdfUrl = data.pdfUrl;
    this.filename = data.filename;
    this.fileBlob = data.fileBlob;
    if (data) {
        if (data.title) {
          this.title = data.title;
        }
        if (data.buttonText) {
          this.buttonText = data.buttonText;
        }
      }
  }

  downloadPdf(): void {
    if (this.fileBlob) {
      saveAs(this.fileBlob, this.filename);
    }
  }

}

import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { saveAs } from 'file-saver'; // Asegúrate de tener instalado file-saver: npm install file-saver
import { OrdenCarga } from 'src/app/interfaces/orden-carga';

@Component({
  selector: 'app-pdf-preview-dialog',
  templateUrl: './pdf-preview-dialog.component.html',
  styleUrls: ['./pdf-preview-dialog.component.scss']
})
export class PdfPreviewDialogComponent {
  pdfUrl: string;
  filename: string;
  fileBlob: Blob;
  oc?: OrdenCarga;
  isGeneratingPdf: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.pdfUrl = data.pdfUrl;
    this.filename = data.filename; // Recibe el nombre del archivo
    this.fileBlob = data.fileBlob;  // Recibe el Blob del archivo
    this.oc = data.oc;
  }

  // Método para descargar el PDF
  downloadPdf(): void {
    if (this.fileBlob) {
      saveAs(this.fileBlob, this.filename);
    }
  }
}

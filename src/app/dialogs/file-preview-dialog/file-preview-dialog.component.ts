import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-file-preview-dialog',
  templateUrl: './file-preview-dialog.component.html',
  styleUrls: ['./file-preview-dialog.component.scss']
})
export class FilePreviewDialogComponent {

  safeUrl: SafeResourceUrl | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { fileUrl: string; fileName: string },
    private sanitizer: DomSanitizer
  ) {
    if (data.fileUrl.endsWith('.pdf')) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.fileUrl);
    }
  }

}

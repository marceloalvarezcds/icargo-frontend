import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-http-error-snack-bar',
  templateUrl: './http-error-snack-bar.component.html',
  styleUrls: ['./http-error-snack-bar.component.scss']
})
export class HttpErrorSnackBarComponent {

  constructor(
    public snackBarRef: MatSnackBarRef<HttpErrorSnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public errors: string[]
  ) {}

  replaceNewLineByBreak(str: string): string {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

}

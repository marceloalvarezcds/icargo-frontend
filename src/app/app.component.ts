import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingDialogComponent } from './dialogs/loading-dialog/loading-dialog.component';
import { HttpErrorService } from './services/http-error.service';
import { LoadingService } from './services/loading.service';
import { HttpErrorSnackBarComponent } from './shared/http-error-snack-bar/http-error-snack-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  loading = false;
  loadingDialogRef?: MatDialogRef<LoadingDialogComponent>;
  loadingSubscription = this.loadingService
    .getLoadingObservable()
    .subscribe((loading) => {
      if (loading) {
        if (!this.loadingDialogRef) {
          this.loadingDialogRef = this.openLoadingDialog();
        }
      } else {
        this.loadingDialogRef?.close();
      }
      setTimeout(() => {
        this.loading = loading;
      }, 0);
    });

  httpErrorSubscription = this.httpErrorService
    .getHttpErrorListObservable()
    .subscribe((errors: string[]) => {
      this.snackBar.openFromComponent(HttpErrorSnackBarComponent, {
        panelClass: ['http-error-snackbar'],
        data: errors,
      });
    });

  constructor(
    private httpErrorService: HttpErrorService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnDestroy(): void {
    this.httpErrorSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }

  openLoadingDialog(): MatDialogRef<LoadingDialogComponent> {
    return this.dialog.open(LoadingDialogComponent, {
      panelClass: 'loading-dialog',
      disableClose: true,
    });
  }
}

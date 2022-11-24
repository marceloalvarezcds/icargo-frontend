import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorService } from './services/http-error.service';
import { LoadingService } from './services/loading.service';
import { HttpErrorSnackBarComponent } from './shared/http-error-snack-bar/http-error-snack-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  loading = false;
  loadingSubscription = this.loadingService
    .getLoadingObservable()
    .subscribe((loading) => {
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
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.httpErrorSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }
}

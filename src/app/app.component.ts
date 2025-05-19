import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorService } from './services/http-error.service';
import { LoadingService } from './services/loading.service';
import { HttpErrorSnackBarComponent } from './shared/http-error-snack-bar/http-error-snack-bar.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
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
    private snackBar: MatSnackBar,
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event:any) => {

          const child: ActivatedRoute | null = this.route.firstChild;
          console.log("title getter ", event);

          if (event instanceof NavigationEnd)
            if (event.url) {

              const arr = event.url.split('/')

              console.log("postInit ", arr);

              if (arr.length>=2 && arr[2]){
                let title = arr[2];
                title = title.replace("_", " ");
                title = title.replace("-", " ");
                title = String(title).charAt(0).toUpperCase() + String(title).slice(1);
                return title;
              }

            }

          return null;

        })
      )
      .subscribe((title) => {
        if (title) {
          this.titleService.setTitle(`iCargo | ${title}`);
        }
      });
  }

  ngOnDestroy(): void {
    this.httpErrorSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }

}

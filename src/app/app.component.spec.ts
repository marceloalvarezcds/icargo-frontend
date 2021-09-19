import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { DialogsModule } from './dialogs/dialogs.module';
import { HttpErrorService } from './services/http-error.service';
import { LoadingService } from './services/loading.service';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpErrorService: HttpErrorService;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        DialogsModule,
        SharedModule,
      ],
      declarations: [
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        LoadingService,
        HttpErrorService,
        { provide: MatDialogRef, useValue: MatDialog },
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpErrorService = TestBed.inject(HttpErrorService);
    loadingService = TestBed.inject(LoadingService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('test ngOnInit', () => {
    // Trigger ngOnInit()
    fixture.detectChanges();
    expect(component.loading).toBeFalsy();
    expect(component.httpErrorSubscription).toBeDefined();
    expect(component.loadingSubscription).toBeDefined();
  });

  it('test httpErrorService', fakeAsync(() => {
    const snackBar = (component as any).snackBar;
    spyOn(snackBar, 'openFromComponent')
    httpErrorService.setErrorList(['Error 1']);
    flushMicrotasks();
    expect(snackBar.openFromComponent).toHaveBeenCalled();
  }));

  it('test loadingService', fakeAsync(() => {
    loadingService.startLoading();
    tick(1000);
    fixture.detectChanges();
    expect(component.loading).toBeTrue();
    expect(component.loadingDialogRef).toBeDefined();

    loadingService.stopLoading();
    tick(1000);
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
    expect(component.loadingDialogRef).toBeDefined();

    loadingService.startLoading();
    tick(1000);
    fixture.detectChanges();
    expect(component.loading).toBeTrue();
    expect(component.loadingDialogRef).toBeDefined();
  }));
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SeleccionableFormDialogComponent } from 'src/app/dialogs/seleccionable-form-dialog/seleccionable-form-dialog.component';
import { SeleccionableFormDialogData } from 'src/app/interfaces/seleccionable-form-dialog-data';
import { SeleccionableService } from 'src/app/services/seleccionable.service';

import { SeleccionableListService } from './seleccionable-list.service';

describe('SeleccionableListService', () => {
  let service: SeleccionableListService<
    SeleccionableFormDialogComponent,
    SeleccionableFormDialogData
  >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      providers: [
        SeleccionableService,
        SeleccionableListService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
    });
    service = TestBed.inject(SeleccionableListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

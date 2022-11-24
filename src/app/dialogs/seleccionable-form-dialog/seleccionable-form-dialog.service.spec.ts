import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { SeleccionableService } from 'src/app/services/seleccionable.service';

import { SeleccionableFormDialogService } from './seleccionable-form-dialog.service';

describe('SeleccionableFormDialogService', () => {
  let service: SeleccionableFormDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        SeleccionableService,
        SeleccionableFormDialogService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
    });
    service = TestBed.inject(SeleccionableFormDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

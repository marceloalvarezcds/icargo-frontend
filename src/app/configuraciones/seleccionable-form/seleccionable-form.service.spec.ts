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
import { SeleccionableFormService } from './seleccionable-form.service';

describe('SeleccionableFormService', () => {
  let service: SeleccionableFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [
        SeleccionableService,
        SeleccionableFormService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
    });
    service = TestBed.inject(SeleccionableFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

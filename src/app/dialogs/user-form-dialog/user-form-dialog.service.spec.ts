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
import { UserService } from 'src/app/services/user.service';

import { UserFormDialogService } from './user-form-dialog.service';

describe('UserFormDialogService', () => {
  let service: UserFormDialogService;

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
        UserService,
        UserFormDialogService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
    });
    service = TestBed.inject(UserFormDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

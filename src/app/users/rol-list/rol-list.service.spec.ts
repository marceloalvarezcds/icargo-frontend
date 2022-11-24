import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { RolService } from 'src/app/services/rol.service';
import { UsersModule } from '../users.module';

import { RolListService } from './rol-list.service';

describe('RolListService', () => {
  let service: RolListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, UsersModule, HttpClientTestingModule],
      providers: [
        RolService,
        RolListService,
        { provide: MatSnackBarRef, useValue: MatSnackBar },
      ],
    });
    service = TestBed.inject(RolListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

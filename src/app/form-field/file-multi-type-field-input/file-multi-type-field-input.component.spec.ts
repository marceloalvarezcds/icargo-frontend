import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMultiTypeFieldInputComponent } from './file-multi-type-field-input.component';

describe('FileMultiTypeFieldInputComponent', () => {
  let component: FileMultiTypeFieldInputComponent;
  let fixture: ComponentFixture<FileMultiTypeFieldInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileMultiTypeFieldInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileMultiTypeFieldInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

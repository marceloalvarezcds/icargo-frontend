import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileFieldInputComponent } from './file-field-input.component';

describe('FileFieldInputComponent', () => {
  let component: FileFieldInputComponent;
  let fixture: ComponentFixture<FileFieldInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileFieldInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileFieldInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileFieldImageComponent } from './file-field-image.component';

describe('FileFieldImageComponent', () => {
  let component: FileFieldImageComponent;
  let fixture: ComponentFixture<FileFieldImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileFieldImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileFieldImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

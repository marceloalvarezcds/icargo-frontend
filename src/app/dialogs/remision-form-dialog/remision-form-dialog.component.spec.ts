import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemisionFormDialogComponent } from './remision-form-dialog.component';

describe('RemisionFormDialogComponent', () => {
  let component: RemisionFormDialogComponent;
  let fixture: ComponentFixture<RemisionFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemisionFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemisionFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemiFormDialogComponent } from './semi-form-dialog.component';

describe('SemiFormDialogComponent', () => {
  let component: SemiFormDialogComponent;
  let fixture: ComponentFixture<SemiFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SemiFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemiFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

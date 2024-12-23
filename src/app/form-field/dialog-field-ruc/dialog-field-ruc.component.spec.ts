import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFieldRucComponent } from './dialog-field-ruc.component';

describe('DialogFieldRucComponent', () => {
  let component: DialogFieldRucComponent;
  let fixture: ComponentFixture<DialogFieldRucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFieldRucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFieldRucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

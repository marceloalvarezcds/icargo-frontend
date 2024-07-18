import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFieldOcComponent } from './dialog-field-oc.component';

describe('DialogFieldOcComponent', () => {
  let component: DialogFieldOcComponent;
  let fixture: ComponentFixture<DialogFieldOcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFieldOcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFieldOcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

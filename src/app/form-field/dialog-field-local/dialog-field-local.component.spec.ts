import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFieldLocalComponent } from './dialog-field-local.component';

describe('DialogFieldLocalComponent', () => {
  let component: DialogFieldLocalComponent;
  let fixture: ComponentFixture<DialogFieldLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFieldLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFieldLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

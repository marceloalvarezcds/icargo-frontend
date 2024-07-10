import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMapFieldComponent } from './dialog-map-field.component';

describe('DialogMapFieldComponent', () => {
  let component: DialogMapFieldComponent;
  let fixture: ComponentFixture<DialogMapFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMapFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMapFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

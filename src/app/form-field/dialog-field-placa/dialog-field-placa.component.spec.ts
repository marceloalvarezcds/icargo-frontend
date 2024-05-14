import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFieldPlacaComponent } from './dialog-field-placa.component';

describe('DialogFieldPlacaComponent', () => {
  let component: DialogFieldPlacaComponent;
  let fixture: ComponentFixture<DialogFieldPlacaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFieldPlacaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFieldPlacaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

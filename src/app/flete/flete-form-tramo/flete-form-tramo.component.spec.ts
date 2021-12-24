import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleteFormTramoComponent } from './flete-form-tramo.component';

describe('FleteFormTramoComponent', () => {
  let component: FleteFormTramoComponent;
  let fixture: ComponentFixture<FleteFormTramoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleteFormTramoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FleteFormTramoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

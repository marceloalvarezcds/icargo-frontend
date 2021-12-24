import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleteFormMermaComponent } from './flete-form-merma.component';

describe('FleteFormMermaComponent', () => {
  let component: FleteFormMermaComponent;
  let fixture: ComponentFixture<FleteFormMermaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleteFormMermaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FleteFormMermaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

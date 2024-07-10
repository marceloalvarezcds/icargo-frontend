import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaFormDialogComponent } from './mapa-form-dialog.component';

describe('MapaFormDialogComponent', () => {
  let component: MapaFormDialogComponent;
  let fixture: ComponentFixture<MapaFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

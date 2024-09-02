import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOcComponent } from './table-oc.component';

describe('TableOcComponent', () => {
  let component: TableOcComponent;
  let fixture: ComponentFixture<TableOcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableOcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableOcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

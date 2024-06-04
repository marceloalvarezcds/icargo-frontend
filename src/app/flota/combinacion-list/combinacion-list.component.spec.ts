import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinacionListComponent } from './combinacion-list.component';

describe('CombinacionListComponent', () => {
  let component: CombinacionListComponent;
  let fixture: ComponentFixture<CombinacionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinacionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

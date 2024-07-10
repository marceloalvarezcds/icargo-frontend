import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFormMapComponent } from './page-form-map.component';

describe('PageFormMapComponent', () => {
  let component: PageFormMapComponent;
  let fixture: ComponentFixture<PageFormMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageFormMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFormMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

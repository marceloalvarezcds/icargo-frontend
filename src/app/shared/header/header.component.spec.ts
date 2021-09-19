import { CommonModule } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { mockUser } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { MenuConfigService } from 'src/app/services/menu-config.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../shared.module';

import { HeaderComponent } from './header.component';

@Component({ template: '' })
class TestComponent { }

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let httpController: HttpTestingController;
  let menuConfigService: MenuConfigService;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule,
        MaterialModule,
        MatIconTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: TestComponent }
        ]),
        SharedModule,
      ],
      providers: [
        AuthService,
        MenuConfigService,
        UserService,
        { provide: MatDialogRef, useValue: MatDialog },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ HeaderComponent ]
    })
    .overrideComponent(HeaderComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    httpController = TestBed.inject(HttpTestingController);
    menuConfigService = TestBed.inject(MenuConfigService);
    userService = TestBed.inject(UserService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test toggleSidebarMenu', fakeAsync(() => {
    menuConfigService.setMenuItemList([{
      name: 'Escritorio',
      iconName: 'speed',
      path: '',
      active: true,
      isRouteExact: true,
    }]);

    tick();
    fixture.detectChanges();

    const toggleSidebarMenuSpy = spyOn(component, 'toggleSidebarMenu').and.callThrough();
    let button = fixture.debugElement.nativeElement.querySelector('.btn-expander');
    button.click();

    tick();
    expect(toggleSidebarMenuSpy).toHaveBeenCalled();
  }));

  it('test logout', fakeAsync(() => {
    const getLoggedUserSpy = spyOn(userService , 'getLoggedUser').and.callThrough();
    userService.getLoggedUser().subscribe();
    expect(getLoggedUserSpy).toHaveBeenCalledTimes(1);

    const url = `${environment.api}/user/`;
    const requests = httpController.match(url).filter(req => !req.cancelled);
    requests.forEach(req => req.flush(mockUser)); // flush execute subscribe of getLoggedUser Observable

    fixture.detectChanges();

    const logoutSpy = spyOn(component, 'logout').and.callThrough();
    component.logout();
    expect(logoutSpy).toHaveBeenCalled();

    httpController.verify();
  }));
});

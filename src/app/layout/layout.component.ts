import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { MenuItem } from 'src/app/interfaces/menu-item';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [MenuService],
})
export class LayoutComponent implements OnDestroy, AfterViewInit {
  @HostListener('window:resize')
  onResize(): void {
    this.menuService.configSidebarModeByScreen();
  }

  @ViewChild(MatSidenav)
  get sidenav(): MatSidenav | undefined {
    return this.nav;
  }
  set sidenav(nav: MatSidenav | undefined) {
    if (nav) {
      this.nav = nav;
      this.menuService.setSidenav(nav);
    }
  }
  nav?: MatSidenav;

  get menuList$(): Observable<MenuItem[]> {
    return this.menuService.list$;
  }

  get sidebarMode(): MatDrawerMode {
    return this.menuService.sidebarMode;
  }

  constructor(private menuService: MenuService) {}

  ngOnDestroy(): void {
    this.menuService.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.menuService.configSidebarModeByScreen();
  }

  closeSidebarMenu(): void {
    this.menuService.closeSidebarMenu();
  }
}

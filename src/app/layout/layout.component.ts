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
import { Tab } from 'src/app/interfaces/tab';
import { MenuService } from './menu.service';
import { TabService } from './tab.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [MenuService, TabService],
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

  get isExpanded(): boolean {
    return this.menuService.isExpanded;
  }

  get menuList$(): Observable<MenuItem[]> {
    return this.menuService.list$;
  }

  get sidebarMode(): MatDrawerMode {
    return this.menuService.sidebarMode;
  }

  get tabs(): Tab[] {
    return this.tabService.list;
  }

  constructor(
    private menuService: MenuService,
    private tabService: TabService
  ) {}

  ngOnDestroy(): void {
    this.menuService.unsubscribe();
    this.tabService.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.menuService.configSidebarModeByScreen();
  }

  closeSidebarMenu(): void {
    this.menuService.closeSidebarMenu();
  }

  removeTab(index: number) {
    this.tabService.removeTab(index);
  }
}

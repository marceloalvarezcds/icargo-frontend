import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { Route } from '@angular/router';
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

  @ViewChildren('frame', { read: ViewContainerRef })
  set frame(f: QueryList<ViewContainerRef> | undefined) {
    this.tabService.setFrameList(f);
  }

  get currentRoute(): Route | undefined {
    return this.tabService.currentRoute;
  }

  get currentUrl(): string {
    return this.tabService.currentUrl;
  }

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

  get selected(): FormControl {
    return this.tabService.selected;
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

  setSelectedIndexChange(index: number) {
    this.tabService.setSelectedIndexChange(index);
  }
}

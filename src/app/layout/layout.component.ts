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
import { Router } from '@angular/router';

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

  get isExpanded(): boolean {
    return this.menuService.isExpanded;
  }

  get menuList$(): Observable<MenuItem[]> {
    return this.menuService.list$;
  }

  get sidebarMode(): MatDrawerMode {
    return this.menuService.sidebarMode;
  }

  constructor(private menuService: MenuService, private router: Router) {}

  ngOnDestroy(): void {
    this.menuService.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.menuService.configSidebarModeByScreen();
  }

  closeSidebarMenu(): void {
    this.menuService.closeSidebarMenu();
  }

  handleMenuClick(event: MouseEvent, path: string | any[] | undefined): void {
    event.stopPropagation();  
    this.openInNewTab(path);   
  }

  openInNewTab(path: string | any[] | undefined): void {
    const currentPath = window.location.pathname;

    if (currentPath === '/' || path === '') {
      if (typeof path === 'string') {
        this.router.navigate([path]);
      } else if (Array.isArray(path)) {
        window.location.href = this.constructPathFromArray(path);
      }
    } else {
      if (typeof path === 'string') {
        window.open(path, '_blank');
      } else if (Array.isArray(path)) {
        window.open(this.constructPathFromArray(path), '_blank');
      }
    }
  }

  private constructPathFromArray(pathArray: any[]): string {
    return pathArray.join('/');
  }
}
